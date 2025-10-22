import { useState } from 'react';
import { aiService } from '../../services/aiService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Label } from '../../components/Label';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAnalysis(null);
    setLoading(true);

    try {
      const { analysis: result } = await aiService.analyzeSymptoms(symptoms);
      setAnalysis(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      case 'high':
        return 'text-orange-600 dark:text-orange-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-green-600 dark:text-green-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Symptom Checker</h1>
        <p className="text-muted-foreground mt-2">
          Describe your symptoms and get AI-powered analysis
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Your Symptoms</CardTitle>
          <CardDescription>
            Please describe your symptoms in detail. This is not a substitute for professional medical advice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms Description</Label>
              <textarea
                id="symptoms"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Example: I've been experiencing persistent headaches for the past 3 days, along with mild nausea and sensitivity to light..."
                required
                minLength={10}
              />
            </div>
            <Button type="submit" disabled={loading || symptoms.length < 10}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Symptoms'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              AI-powered analysis of your symptoms (Not a substitute for professional medical advice)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Severity Assessment</h3>
              <div className={`text-2xl font-bold ${getSeverityColor(analysis.aiResponse?.severity)}`}>
                {analysis.aiResponse?.severity?.toUpperCase() || 'UNKNOWN'}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Confidence: {analysis.aiResponse?.confidence || 0}%
              </p>
            </div>

            {analysis.aiResponse?.possibleDiagnosis && analysis.aiResponse.possibleDiagnosis.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Possible Diagnoses</h3>
                <div className="space-y-3">
                  {analysis.aiResponse.possibleDiagnosis.map((diagnosis, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{diagnosis.condition}</h4>
                        <span className="text-sm text-muted-foreground">
                          {(diagnosis.probability * 100).toFixed(0)}% probability
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{diagnosis.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.aiResponse?.recommendedActions && analysis.aiResponse.recommendedActions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Recommended Actions</h3>
                <ul className="space-y-2">
                  {analysis.aiResponse.recommendedActions.map((action, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.aiResponse?.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
                <p className="text-sm text-muted-foreground">{analysis.aiResponse.notes}</p>
              </div>
            )}

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Important:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult with a healthcare professional for proper diagnosis and treatment.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


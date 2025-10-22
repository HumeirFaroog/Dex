import { useEffect, useState } from 'react';
import { aiService } from '../../services/aiService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Activity, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export const PatientAnalyses = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const { analyses: data } = await aiService.getAll();
      setAnalyses(data);
    } catch (error) {
      console.error('Failed to fetch analyses:', error);
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

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Health Analyses</h1>
        <p className="text-muted-foreground mt-2">View your AI-powered health analyses</p>
      </div>

      <div className="grid gap-4">
        {analyses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No analyses found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Use the Symptom Checker to get your first AI analysis
              </p>
            </CardContent>
          </Card>
        ) : (
          analyses.map((analysis) => (
            <Card key={analysis._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Analysis #{analysis._id.slice(-6)}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(analysis.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <div className={`text-lg font-bold ${getSeverityColor(analysis.aiResponse?.severity)}`}>
                    {analysis.aiResponse?.severity?.toUpperCase() || 'UNKNOWN'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Your Input:</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {analysis.userInput}
                  </p>
                </div>

                {analysis.aiResponse?.possibleDiagnosis && analysis.aiResponse.possibleDiagnosis.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Possible Diagnoses:</h4>
                    <div className="space-y-2">
                      {analysis.aiResponse.possibleDiagnosis.map((diagnosis, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">{diagnosis.condition}</span>
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
                    <h4 className="font-semibold mb-2">Recommended Actions:</h4>
                    <ul className="space-y-1">
                      {analysis.aiResponse.recommendedActions.map((action, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm text-muted-foreground">
                    Confidence: {analysis.aiResponse?.confidence || 0}%
                  </div>
                  {analysis.isReviewed && (
                    <div className="flex items-center space-x-1 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Reviewed by Doctor</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};


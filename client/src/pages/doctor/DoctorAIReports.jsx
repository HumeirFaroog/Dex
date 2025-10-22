import { useEffect, useState } from 'react';
import { aiService } from '../../services/aiService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Label } from '../../components/Label';
import { Activity, Search, User, Calendar, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export const DoctorAIReports = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [reviewData, setReviewData] = useState({
    doctorNotes: '',
    isReviewed: false,
    accuracy: null,
  });

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const { analyses: data } = await aiService.getAll();
      // Filter to show only analyses that haven't been reviewed or need review
      setAnalyses(data);
    } catch (error) {
      console.error('Failed to fetch analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await aiService.update(selectedAnalysis._id, reviewData);
      setSelectedAnalysis(null);
      setReviewData({ doctorNotes: '', isReviewed: false, accuracy: null });
      fetchAnalyses();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update analysis');
    }
  };

  const openReviewForm = (analysis) => {
    setSelectedAnalysis(analysis);
    setReviewData({
      doctorNotes: analysis.doctorNotes || '',
      isReviewed: analysis.isReviewed || false,
      accuracy: analysis.accuracy || null,
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const filteredAnalyses = analyses.filter(analysis => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      analysis.patient?.name?.toLowerCase().includes(search) ||
      analysis.userInput?.toLowerCase().includes(search) ||
      analysis.aiResponse?.possibleDiagnosis?.some(d => 
        d.condition?.toLowerCase().includes(search)
      )
    );
  });

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Health Analyses</h1>
        <p className="text-muted-foreground mt-2">Review and validate AI-powered health analyses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, symptoms, or diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {selectedAnalysis && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Review Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReview} className="space-y-4">
              <div className="space-y-2">
                <Label>Patient: {selectedAnalysis.patient?.name || 'Unknown'}</Label>
                <Label>Date: {format(new Date(selectedAnalysis.createdAt), 'MMM dd, yyyy HH:mm')}</Label>
                <Label>Severity: {selectedAnalysis.aiResponse?.severity?.toUpperCase() || 'UNKNOWN'}</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctorNotes">Doctor Notes</Label>
                <textarea
                  id="doctorNotes"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={reviewData.doctorNotes}
                  onChange={(e) => setReviewData({ ...reviewData, doctorNotes: e.target.value })}
                  placeholder="Add your professional assessment and notes..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accuracy">Accuracy Rating (0-100%)</Label>
                  <Input
                    id="accuracy"
                    type="number"
                    min="0"
                    max="100"
                    value={reviewData.accuracy || ''}
                    onChange={(e) => setReviewData({ ...reviewData, accuracy: parseInt(e.target.value) || null })}
                    placeholder="Rate AI accuracy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isReviewed">Review Status</Label>
                  <select
                    id="isReviewed"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={reviewData.isReviewed ? 'true' : 'false'}
                    onChange={(e) => setReviewData({ ...reviewData, isReviewed: e.target.value === 'true' })}
                  >
                    <option value="false">Pending Review</option>
                    <option value="true">Reviewed</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Save Review</Button>
                <Button type="button" variant="outline" onClick={() => setSelectedAnalysis(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredAnalyses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No analyses found</p>
            </CardContent>
          </Card>
        ) : (
          filteredAnalyses.map((analysis) => (
            <Card key={analysis._id} className={analysis.isReviewed ? 'border-green-500' : 'border-yellow-500'}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Analysis #{analysis._id.slice(-6)}</span>
                      {analysis.isReviewed && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{analysis.patient?.name || 'Unknown Patient'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(analysis.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(analysis.aiResponse?.severity)}`}>
                      {analysis.aiResponse?.severity?.toUpperCase() || 'UNKNOWN'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {analysis.aiResponse?.confidence || 0}% confidence
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Patient Input:</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {analysis.userInput}
                  </p>
                </div>

                {analysis.aiResponse?.possibleDiagnosis && analysis.aiResponse.possibleDiagnosis.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">AI Suggested Diagnoses:</h4>
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
                          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.doctorNotes && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold mb-1 text-sm flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>Doctor Notes:</span>
                    </h4>
                    <p className="text-sm">{analysis.doctorNotes}</p>
                    {analysis.accuracy !== null && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Accuracy Rating: {analysis.accuracy}%
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-end pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openReviewForm(analysis)}
                  >
                    {analysis.isReviewed ? 'Update Review' : 'Review Analysis'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};


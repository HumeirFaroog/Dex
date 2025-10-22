import { useEffect, useState } from 'react';
import { aiService } from '../../services/aiService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Input } from '../../components/Input';
import { Activity, Search, Calendar, User, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export const AdminAIAnalyses = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
        <h1 className="text-3xl font-bold">AI Analyses</h1>
        <p className="text-muted-foreground mt-2">View all AI-powered health analyses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by patient name, symptoms, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

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
            <Card key={analysis._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Analysis #{analysis._id.slice(-6)}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{analysis.patient?.name || 'Unknown Patient'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(analysis.createdAt), 'MMM dd, yyyy HH:mm')}</span>
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
                        <li key={index} className="text-sm">• {action}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.doctorNotes && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold mb-1 text-sm">Doctor Notes:</h4>
                    <p className="text-sm">{analysis.doctorNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};


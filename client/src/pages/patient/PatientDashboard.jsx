import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { appointmentService } from '../../services/appointmentService';
import { aiService } from '../../services/aiService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Calendar, Activity, FileText, Stethoscope, TrendingUp, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, appointmentsResponse, analysesResponse, trendsResponse] = await Promise.all([
          userService.getStats(),
          appointmentService.getAll().catch(() => ({ appointments: [] })),
          aiService.getAll().catch(() => ({ analyses: [] })),
          userService.getTrends().catch(() => ({ trends: [] })),
        ]);
        setStats(statsResponse.stats);
        const appointments = appointmentsResponse.appointments || [];
        setRecentAppointments(appointments.slice(0, 3));
        const analyses = analysesResponse.analyses || [];
        setRecentAnalyses(analyses.slice(0, 3));
        setTrends(trendsResponse.trends || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground mt-2">Here's your health overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.myAppointments || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.upcomingAppointments || 0} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.myAnalyses || 0}</div>
            <p className="text-xs text-muted-foreground">Total analyses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.myReports || 0}</div>
            <p className="text-xs text-muted-foreground">Medical reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link to="/patient/symptom-checker">
                <Button variant="outline" size="sm" className="w-full">
                  Check Symptoms
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/patient/appointments">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Appointments
              </Button>
            </Link>
            <Link to="/patient/symptom-checker">
              <Button variant="outline" className="w-full justify-start">
                <Stethoscope className="mr-2 h-4 w-4" />
                Symptom Checker
              </Button>
            </Link>
            <Link to="/patient/reports">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Medical Reports
              </Button>
            </Link>
            <Link to="/patient/analyses">
              <Button variant="outline" className="w-full justify-start">
                <Activity className="mr-2 h-4 w-4" />
                AI Analyses
              </Button>
            </Link>
            <Link to="/patient/profile">
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent appointments
              </p>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex justify-between items-center p-2 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">
                        Dr. {appointment.doctor?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(appointment.appointmentDate), 'MMM dd')} at {appointment.appointmentTime}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
                <Link to="/patient/appointments">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View All
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent AI Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAnalyses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No analyses yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentAnalyses.map((analysis) => (
                  <div key={analysis._id} className="p-2 border rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">
                        {format(new Date(analysis.createdAt), 'MMM dd')}
                      </span>
                      <span className={`text-xs font-medium ${
                        analysis.aiResponse?.severity === 'high' ? 'text-orange-600' :
                        analysis.aiResponse?.severity === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {analysis.aiResponse?.severity?.toUpperCase() || 'LOW'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {analysis.userInput.substring(0, 100)}...
                    </p>
                  </div>
                ))}
                <Link to="/patient/analyses">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View All
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {trends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Health Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends.map(t => ({
                date: format(new Date(t.date), 'MMM dd'),
                confidence: t.confidence || 0,
                accuracy: t.accuracy || 0,
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="confidence" stroke="#8884d8" name="Confidence %" />
                <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" name="Accuracy %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


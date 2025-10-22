import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { appointmentService } from '../../services/appointmentService';
import { aiService } from '../../services/aiService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Calendar, Users, FileText, Activity, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [pendingAnalyses, setPendingAnalyses] = useState([]);
  const [appointmentStats, setAppointmentStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, appointmentsResponse, analysesResponse] = await Promise.all([
          userService.getStats(),
          appointmentService.getAll().catch(() => ({ appointments: [] })),
          aiService.getAll().catch(() => ({ analyses: [] })),
        ]);
        setStats(statsResponse.stats);
        const appointments = appointmentsResponse.appointments || [];
        setRecentAppointments(appointments.slice(0, 5));
        
        // Get pending analyses (not reviewed)
        const analyses = analysesResponse.analyses || [];
        setPendingAnalyses(analyses.filter(a => !a.isReviewed).slice(0, 3));

        // Prepare appointment stats for chart
        const statusCounts = appointments.reduce((acc, apt) => {
          acc[apt.status] = (acc[apt.status] || 0) + 1;
          return acc;
        }, {});
        setAppointmentStats(Object.entries(statusCounts).map(([status, count]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1),
          count
        })));
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
        <h1 className="text-3xl font-bold">Welcome, Dr. {user?.name}</h1>
        <p className="text-muted-foreground mt-2">Your practice overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.myAppointments || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingAppointments || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPatients || 0}</div>
            <p className="text-xs text-muted-foreground">Active patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedAppointments || 0}</div>
            <p className="text-xs text-muted-foreground">Completed appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.myAnalyses || 0}</div>
            <p className="text-xs text-muted-foreground">Reviewed analyses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/doctor/appointments">
              <button className="w-full text-left px-4 py-2 rounded-md border hover:bg-accent">
                View Appointments
              </button>
            </Link>
            <Link to="/doctor/patients">
              <button className="w-full text-left px-4 py-2 rounded-md border hover:bg-accent">
                Manage Patients
              </button>
            </Link>
            <Link to="/doctor/ai-reports">
              <button className="w-full text-left px-4 py-2 rounded-md border hover:bg-accent">
                Review AI Reports
              </button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming appointments
              </p>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex justify-between items-center p-2 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{appointment.patient?.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(appointment.appointmentDate), 'MMM dd')} at {appointment.appointmentTime}
                      </p>
                      {appointment.reason && (
                        <p className="text-xs text-muted-foreground mt-1">{appointment.reason}</p>
                      )}
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
                <Link to="/doctor/appointments">
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
            <CardTitle>Pending AI Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingAnalyses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No pending reviews
              </p>
            ) : (
              <div className="space-y-3">
                {pendingAnalyses.map((analysis) => (
                  <div key={analysis._id} className="p-2 border rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">
                        {analysis.patient?.name || 'Unknown Patient'}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        analysis.aiResponse?.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        analysis.aiResponse?.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {analysis.aiResponse?.severity?.toUpperCase() || 'LOW'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {analysis.userInput.substring(0, 100)}...
                    </p>
                  </div>
                ))}
                <Link to="/doctor/ai-reports">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Review All
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {appointmentStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Appointment Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


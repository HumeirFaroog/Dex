import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import { appointmentService } from '../../services/appointmentService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Users, UserCheck, Calendar, Activity, FileText, Clock, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, trendsResponse, appointmentsResponse] = await Promise.all([
          userService.getStats(),
          userService.getTrends(),
          appointmentService.getAll().catch(() => ({ appointments: [] })),
        ]);
        setStats(statsResponse.stats);
        setTrends(trendsResponse.trends || []);
        const appointments = appointmentsResponse.appointments || [];
        setRecentAppointments(appointments.slice(0, 5));
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

  const chartData = trends.map((trend, index) => ({
    date: new Date(trend.date).toLocaleDateString(),
    confidence: trend.confidence || 0,
    accuracy: trend.accuracy || 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">System overview and analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalPatients || 0} patients, {stats?.totalDoctors || 0} doctors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAppointments || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingAppointments || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAnalyses || 0}</div>
            <p className="text-xs text-muted-foreground">Total AI analyses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingAppointments || 0}</div>
            <p className="text-xs text-muted-foreground">Pending appointments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Health Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="confidence" stroke="#8884d8" name="Confidence %" />
                  <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" name="Accuracy %" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">
                No trend data available yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No appointments yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {appointment.patient?.name || 'Unknown Patient'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.doctor?.name || 'Unknown Doctor'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')} at {appointment.appointmentTime}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      appointment.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/admin/users">
              <button className="w-full text-left px-4 py-2 rounded-md border hover:bg-accent">
                <Users className="inline h-4 w-4 mr-2" />
                Manage Users
              </button>
            </Link>
            <Link to="/admin/appointments">
              <button className="w-full text-left px-4 py-2 rounded-md border hover:bg-accent">
                <Calendar className="inline h-4 w-4 mr-2" />
                All Appointments
              </button>
            </Link>
            <Link to="/admin/analytics">
              <button className="w-full text-left px-4 py-2 rounded-md border hover:bg-accent">
                <TrendingUp className="inline h-4 w-4 mr-2" />
                View Analytics
              </button>
            </Link>
            <Link to="/admin/ai-analyses">
              <button className="w-full text-left px-4 py-2 rounded-md border hover:bg-accent">
                <Activity className="inline h-4 w-4 mr-2" />
                AI Analyses
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


import { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { userService } from '../../services/userService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Users, Search, Mail, Phone, Calendar, Activity, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsResponse, usersResponse] = await Promise.all([
        appointmentService.getAll(),
        userService.getAll({ role: 'patient' }),
      ]);

      const appointmentsData = appointmentsResponse.appointments || [];
      setAppointments(appointmentsData);

      // Get unique patients from appointments
      const patientIds = [...new Set(appointmentsData.map(apt => apt.patient?._id || apt.patient))];
      const allPatients = usersResponse.users || [];
      
      // Filter to only show patients who have appointments with this doctor
      const myPatients = allPatients.filter(p => patientIds.includes(p._id));
      setPatients(myPatients);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPatientAppointments = (patientId) => {
    return appointments.filter(apt => (apt.patient?._id || apt.patient) === patientId);
  };

  const filteredPatients = patients.filter(patient => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(search) ||
      patient.email?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Patients</h1>
        <p className="text-muted-foreground mt-2">Manage your patient list</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No patients found</p>
            </CardContent>
          </Card>
        ) : (
          filteredPatients.map((patient) => {
            const patientAppointments = getPatientAppointments(patient._id || patient.id);
            const upcomingAppointments = patientAppointments.filter(apt => 
              apt.status !== 'completed' && apt.status !== 'cancelled' &&
              new Date(apt.appointmentDate) >= new Date()
            );

            return (
              <Card key={patient._id || patient.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{patient.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <span>{patient.email}</span>
                            </div>
                            {patient.phone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="h-4 w-4" />
                                <span>{patient.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Total Appointments</p>
                            <p className="text-xs text-muted-foreground">
                              {patientAppointments.length} appointments
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                          <Activity className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Upcoming</p>
                            <p className="text-xs text-muted-foreground">
                              {upcomingAppointments.length} scheduled
                            </p>
                          </div>
                        </div>
                        {patient.bloodGroup && (
                          <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium">Blood Group</p>
                              <p className="text-xs text-muted-foreground">
                                {patient.bloodGroup}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {patientAppointments.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold mb-2">Recent Appointments:</h4>
                          <div className="space-y-2">
                            {patientAppointments.slice(0, 3).map((apt) => (
                              <div key={apt._id} className="flex justify-between items-center p-2 bg-muted rounded-lg text-sm">
                                <div>
                                  <span className="font-medium">
                                    {format(new Date(apt.appointmentDate), 'MMM dd, yyyy')}
                                  </span>
                                  <span className="text-muted-foreground ml-2">
                                    at {apt.appointmentTime}
                                  </span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {apt.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPatient(selectedPatient === patient._id ? null : patient._id)}
                      >
                        {selectedPatient === patient._id ? 'Hide Details' : 'View Details'}
                      </Button>
                      <Link to={`/doctor/appointments?patient=${patient._id}`}>
                        <Button variant="outline" size="sm">
                          View Appointments
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {selectedPatient === patient._id && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {patient.dateOfBirth && (
                          <div>
                            <span className="font-medium">Date of Birth: </span>
                            <span className="text-muted-foreground">
                              {format(new Date(patient.dateOfBirth), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        )}
                        {patient.bloodGroup && (
                          <div>
                            <span className="font-medium">Blood Group: </span>
                            <span className="text-muted-foreground">{patient.bloodGroup}</span>
                          </div>
                        )}
                        {patient.emergencyContact?.name && (
                          <div>
                            <span className="font-medium">Emergency Contact: </span>
                            <span className="text-muted-foreground">
                              {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
                            </span>
                          </div>
                        )}
                        {patient.emergencyContact?.phone && (
                          <div>
                            <span className="font-medium">Emergency Phone: </span>
                            <span className="text-muted-foreground">
                              {patient.emergencyContact.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};


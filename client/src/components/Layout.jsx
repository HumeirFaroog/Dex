import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from './Button';
import { Moon, Sun, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'doctor') return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to={getDashboardPath()} className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary">HealthAI</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {user && (
                <>
                  <Link to={getDashboardPath()} className="text-sm font-medium hover:text-primary">
                    Dashboard
                  </Link>
                  {user.role === 'patient' && (
                    <>
                      <Link to="/patient/appointments" className="text-sm font-medium hover:text-primary">
                        Appointments
                      </Link>
                      <Link to="/patient/symptom-checker" className="text-sm font-medium hover:text-primary">
                        Symptom Checker
                      </Link>
                      <Link to="/patient/reports" className="text-sm font-medium hover:text-primary">
                        Reports
                      </Link>
                      <Link to="/patient/analyses" className="text-sm font-medium hover:text-primary">
                        Analyses
                      </Link>
                      <Link to="/patient/profile" className="text-sm font-medium hover:text-primary">
                        Profile
                      </Link>
                    </>
                  )}
                  {user.role === 'doctor' && (
                    <>
                      <Link to="/doctor/patients" className="text-sm font-medium hover:text-primary">
                        Patients
                      </Link>
                      <Link to="/doctor/appointments" className="text-sm font-medium hover:text-primary">
                        Appointments
                      </Link>
                      <Link to="/doctor/ai-reports" className="text-sm font-medium hover:text-primary">
                        AI Reports
                      </Link>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <>
                      <Link to="/admin/users" className="text-sm font-medium hover:text-primary">
                        Users
                      </Link>
                      <Link to="/admin/appointments" className="text-sm font-medium hover:text-primary">
                        Appointments
                      </Link>
                      <Link to="/admin/analytics" className="text-sm font-medium hover:text-primary">
                        Analytics
                      </Link>
                      <Link to="/admin/ai-analyses" className="text-sm font-medium hover:text-primary">
                        AI Analyses
                      </Link>
                    </>
                  )}
                </>
              )}
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              {user && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{user.name}</span>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user && (
                <>
                  <Link to={getDashboardPath()} className="block px-3 py-2 text-base font-medium">
                    Dashboard
                  </Link>
                  {user.role === 'patient' && (
                    <>
                      <Link to="/patient/appointments" className="block px-3 py-2 text-base font-medium">
                        Appointments
                      </Link>
                      <Link to="/patient/symptom-checker" className="block px-3 py-2 text-base font-medium">
                        Symptom Checker
                      </Link>
                    </>
                  )}
                  <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};


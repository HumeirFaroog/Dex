import { useEffect, useState } from 'react';
import { reportService } from '../../services/reportService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Label } from '../../components/Label';
import { FileText, Upload, Download, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const PatientReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    reportType: 'general',
    description: '',
    file: null
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { reports: data } = await reportService.getAll();
      setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadData({ ...uploadData, file: e.target.files[0] });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.file) {
      alert('Please select a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('title', uploadData.title);
      formData.append('reportType', uploadData.reportType);
      formData.append('description', uploadData.description);

      await reportService.upload(formData);
      setShowUploadForm(false);
      setUploadData({ title: '', reportType: 'general', description: '', file: null });
      fetchReports();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to upload report');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportService.delete(id);
        fetchReports();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete report');
      }
    }
  };

  const getReportTypeColor = (type) => {
    switch (type) {
      case 'lab':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'imaging':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'prescription':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Medical Reports</h1>
          <p className="text-muted-foreground mt-2">View and manage your medical reports</p>
        </div>
        <Button onClick={() => setShowUploadForm(!showUploadForm)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Report
        </Button>
      </div>

      {showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Medical Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  placeholder="e.g., Blood Test Results"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <select
                  id="reportType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={uploadData.reportType}
                  onChange={(e) => setUploadData({ ...uploadData, reportType: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="lab">Lab Report</option>
                  <option value="imaging">Imaging</option>
                  <option value="prescription">Prescription</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <textarea
                  id="description"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  placeholder="Additional notes about this report..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File (PDF or Image)</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Upload</Button>
                <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reports found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Upload your first medical report to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report._id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">{report.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReportTypeColor(report.reportType)}`}>
                        {report.reportType}
                      </span>
                    </div>
                    {report.description && (
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(report.date || report.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                      {report.fileName && (
                        <span className="text-xs">{report.fileName}</span>
                      )}
                    </div>
                    {report.extractedText && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Extracted Text:</p>
                        <p className="text-sm line-clamp-3">{report.extractedText.substring(0, 200)}...</p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {report.fileUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(report.fileUrl, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(report._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { User, MigrantAssessment } from '@/types';
import { FileText, User as UserIcon, Stethoscope, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DoctorDashboardProps {
  user: User;
  assessments: MigrantAssessment[];
  onUpdateAssessment: (assessmentId: string, updates: Partial<MigrantAssessment>) => void;
  onLogout: () => void;
}

const DoctorDashboard = ({ user, assessments, onUpdateAssessment, onLogout }: DoctorDashboardProps) => {
  const { toast } = useToast();
  const [diagnosisInputs, setDiagnosisInputs] = useState<Record<string, string>>({});
  const [goalsInputs, setGoalsInputs] = useState<Record<string, string>>({});

  const handleDiagnosisChange = (assessmentId: string, value: string) => {
    setDiagnosisInputs(prev => ({ ...prev, [assessmentId]: value }));
  };

  const handleGoalsChange = (assessmentId: string, value: string) => {
    setGoalsInputs(prev => ({ ...prev, [assessmentId]: value }));
  };

  const handleAppointmentAction = (assessmentId: string, status: 'accepted' | 'rejected' | 'completed') => {
    onUpdateAssessment(assessmentId, {
      appointmentStatus: status,
      doctorId: user.id,
      updatedAt: new Date()
    });

    toast({
      title: status === 'accepted' ? "Appointment Accepted" : status === 'rejected' ? "Appointment Rejected" : "Consultation Completed",
      description: status === 'accepted' ? "You can now provide diagnosis and treatment" : 
                   status === 'rejected' ? "Appointment has been rejected" : 
                   "Patient consultation has been marked as completed",
    });
  };

  const handleSaveAssessment = (assessmentId: string) => {
    const diagnosis = diagnosisInputs[assessmentId];
    const preventiveGoals = goalsInputs[assessmentId];
    
    if (!diagnosis || !preventiveGoals) {
      toast({
        title: "Missing Information",
        description: "Please fill in both diagnosis and preventive goals",
        variant: "destructive"
      });
      return;
    }

    onUpdateAssessment(assessmentId, {
      diagnosis,
      preventiveGoals,
      doctorFeedback: `Dr. ${user.name} - ${new Date().toLocaleDateString()}`,
      updatedAt: new Date()
    });

    toast({
      title: "Assessment Saved",
      description: "Patient assessment has been updated successfully",
    });

    // Clear the inputs
    setDiagnosisInputs(prev => ({ ...prev, [assessmentId]: '' }));
    setGoalsInputs(prev => ({ ...prev, [assessmentId]: '' }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
              <p className="text-muted-foreground">Infectious Disease Specialist - {user.name}</p>
            </div>
            <Button variant="outline" onClick={onLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Patient Assessments & Appointments
              </CardTitle>
              <CardDescription>Review appointments and provide medical consultation</CardDescription>
            </CardHeader>
            <CardContent>
              {assessments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No patient assessments yet.</p>
              ) : (
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4" />
                          <span className="font-medium">{assessment.patientName}</span>
                          <Badge variant="secondary">{assessment.migrantType}</Badge>
                          <Badge variant={
                            assessment.infectiousDiseaseRisk === 'High Risk' ? 'destructive' :
                            assessment.infectiousDiseaseRisk === 'Medium Risk' ? 'secondary' : 'default'
                          }>
                            {assessment.infectiousDiseaseRisk}
                          </Badge>
                          <Badge variant={
                            assessment.appointmentStatus === 'accepted' ? 'default' :
                            assessment.appointmentStatus === 'rejected' ? 'destructive' :
                            assessment.appointmentStatus === 'completed' ? 'default' : 'secondary'
                          }>
                            {assessment.appointmentStatus}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {assessment.createdAt.toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><strong>Age:</strong> {assessment.age}</div>
                          <div><strong>Type:</strong> {assessment.migrantType}</div>
                        </div>
                        <div className="text-sm">
                          <strong>Symptoms:</strong> {assessment.symptoms}
                        </div>
                        {assessment.healthHistory && (
                          <div className="text-sm">
                            <strong>Health History:</strong> {assessment.healthHistory}
                          </div>
                        )}
                        {assessment.lifestyle && (
                          <div className="text-sm">
                            <strong>Lifestyle:</strong> {assessment.lifestyle}
                          </div>
                        )}
                        
                        {assessment.bloodTestResults.hemoglobin && (
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                            <p className="text-sm font-medium mb-2">Blood Test Results:</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span>Hemoglobin: {assessment.bloodTestResults.hemoglobin} g/dL</span>
                              <span>WBC: {assessment.bloodTestResults.whiteBloodCells} ×10³/μL</span>
                              <span>Platelets: {assessment.bloodTestResults.platelets} ×10³/μL</span>
                              <span>Blood Sugar: {assessment.bloodTestResults.bloodSugar} mg/dL</span>
                              <span>Cholesterol: {assessment.bloodTestResults.cholesterol} mg/dL</span>
                              <span>Test Date: {assessment.bloodTestResults.testDate}</span>
                            </div>
                          </div>
                        )}

                        {assessment.preDiagnosis && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Pre-Diagnosis:</p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">{assessment.preDiagnosis}</p>
                          </div>
                        )}
                      </div>

                      <Separator className="my-4" />
                      
                      {assessment.appointmentStatus === 'pending' && (
                        <div className="flex gap-2 mb-4">
                          <Button 
                            onClick={() => handleAppointmentAction(assessment.id, 'accepted')}
                            className="flex-1"
                            variant="default"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept Appointment
                          </Button>
                          <Button 
                            onClick={() => handleAppointmentAction(assessment.id, 'rejected')}
                            className="flex-1"
                            variant="destructive"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      {assessment.appointmentStatus === 'accepted' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`diagnosis-${assessment.id}`}>Medical Diagnosis</Label>
                            <Textarea
                              id={`diagnosis-${assessment.id}`}
                              placeholder="Enter your diagnosis..."
                              value={diagnosisInputs[assessment.id] || assessment.diagnosis || ''}
                              onChange={(e) => handleDiagnosisChange(assessment.id, e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`goals-${assessment.id}`}>Prevention & Treatment Goals</Label>
                            <Textarea
                              id={`goals-${assessment.id}`}
                              placeholder="Enter preventive care and treatment recommendations..."
                              value={goalsInputs[assessment.id] || assessment.preventiveGoals || ''}
                              onChange={(e) => handleGoalsChange(assessment.id, e.target.value)}
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleSaveAssessment(assessment.id)}
                              className="flex-1"
                            >
                              Save Assessment
                            </Button>
                            <Button 
                              onClick={() => handleAppointmentAction(assessment.id, 'completed')}
                              className="flex-1"
                              variant="outline"
                            >
                              Mark Completed
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {assessment.appointmentStatus === 'rejected' && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                          <p className="text-sm text-red-700 dark:text-red-300">Appointment was rejected</p>
                        </div>
                      )}
                      
                      {assessment.appointmentStatus === 'completed' && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                          <p className="text-sm text-green-700 dark:text-green-300">Consultation completed</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
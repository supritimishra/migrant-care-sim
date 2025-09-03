import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MigrantAssessment, User } from '@/types';
import { Stethoscope, FileText, Calendar, User as UserIcon, Activity, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DoctorDashboardProps {
  user: User;
  assessments: MigrantAssessment[];
  onUpdateAssessment: (assessmentId: string, updates: Partial<MigrantAssessment>) => void;
  onLogout: () => void;
}

const DoctorDashboard = ({ user, assessments, onUpdateAssessment, onLogout }: DoctorDashboardProps) => {
  const { toast } = useToast();
  const [selectedAssessment, setSelectedAssessment] = useState<MigrantAssessment | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [preventiveGoals, setPreventiveGoals] = useState('');

  const handleSaveFeedback = () => {
    if (!selectedAssessment) return;
    
    if (!diagnosis.trim()) {
      toast({
        title: "Missing Diagnosis",
        description: "Please provide a diagnosis before saving",
        variant: "destructive"
      });
      return;
    }

    onUpdateAssessment(selectedAssessment.id, {
      diagnosis: diagnosis.trim(),
      preventiveGoals: preventiveGoals.trim(),
      doctorFeedback: `Diagnosis: ${diagnosis.trim()}${preventiveGoals.trim() ? `\nPreventive Goals: ${preventiveGoals.trim()}` : ''}`,
      updatedAt: new Date()
    });

    toast({
      title: "Feedback Saved",
      description: `Assessment updated for ${selectedAssessment.patientName}`,
    });

    setSelectedAssessment(null);
    setDiagnosis('');
    setPreventiveGoals('');
  };

  const openAssessment = (assessment: MigrantAssessment) => {
    setSelectedAssessment(assessment);
    setDiagnosis(assessment.diagnosis || '');
    setPreventiveGoals(assessment.preventiveGoals || '');
  };

  const pendingAssessments = assessments.filter(a => !a.diagnosis);
  const completedAssessments = assessments.filter(a => a.diagnosis);

  const getMigrantTypeColor = (type: string) => {
    switch (type) {
      case 'refugee': return 'bg-red-100 text-red-800';
      case 'seasonal': return 'bg-green-100 text-green-800';
      case 'worker': return 'bg-blue-100 text-blue-800';
      case 'asylum_seeker': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
              <p className="text-muted-foreground">Migrant Health Specialist - {user.name}</p>
            </div>
            <Button variant="outline" onClick={onLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Activity className="w-6 h-6 text-accent" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                    <p className="text-2xl font-bold">{pendingAssessments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Target className="w-6 h-6 text-success" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{completedAssessments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <UserIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                    <p className="text-2xl font-bold">{assessments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Assessments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Pending Patient Assessments
                </CardTitle>
                <CardDescription>
                  Migrant health reports awaiting medical review
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingAssessments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No pending assessments</p>
                ) : (
                  <div className="space-y-4">
                    {pendingAssessments.map((assessment) => (
                      <div key={assessment.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{assessment.patientName}</h4>
                              <Badge className={getMigrantTypeColor(assessment.migrantType)}>
                                {assessment.migrantType}
                              </Badge>
                              <span className="text-sm text-muted-foreground">Age: {assessment.age}</span>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <p><strong>Symptoms:</strong> {assessment.symptoms}</p>
                              {assessment.healthHistory && (
                                <p><strong>Health History:</strong> {assessment.healthHistory}</p>
                              )}
                              {assessment.lifestyle && (
                                <p><strong>Lifestyle:</strong> {assessment.lifestyle}</p>
                              )}
                              {assessment.mriFilename && (
                                <p><strong>MRI Upload:</strong> {assessment.mriFilename}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              Submitted: {assessment.createdAt.toLocaleDateString()}
                            </div>
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button onClick={() => openAssessment(assessment)}>
                                Review Case
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Medical Review - {assessment.patientName}</DialogTitle>
                                <DialogDescription>
                                  Provide diagnosis and preventive care recommendations
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                                  <div>
                                    <p className="text-sm font-medium">Patient</p>
                                    <p className="text-sm text-muted-foreground">{assessment.patientName}, {assessment.age} years</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Migrant Type</p>
                                    <Badge className={getMigrantTypeColor(assessment.migrantType)}>
                                      {assessment.migrantType}
                                    </Badge>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="diagnosis">Medical Diagnosis *</Label>
                                  <Textarea
                                    id="diagnosis"
                                    placeholder="Provide detailed diagnosis considering migrant-specific health risks (TB, malnutrition, occupational hazards, etc.)"
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    className="mt-2"
                                    rows={4}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="preventive">Preventive Goals & Recommendations</Label>
                                  <Textarea
                                    id="preventive"
                                    placeholder="Preventive care recommendations (diet, hygiene, vaccination, follow-up care, etc.)"
                                    value={preventiveGoals}
                                    onChange={(e) => setPreventiveGoals(e.target.value)}
                                    className="mt-2"
                                    rows={4}
                                  />
                                </div>

                                <div className="flex justify-end gap-2">
                                  <DialogTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogTrigger>
                                  <DialogTrigger asChild>
                                    <Button onClick={handleSaveFeedback}>
                                      Save Medical Review
                                    </Button>
                                  </DialogTrigger>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Completed Cases */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Completed Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completedAssessments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No completed cases yet</p>
                ) : (
                  <div className="space-y-3">
                    {completedAssessments.slice(0, 5).map((assessment) => (
                      <div key={assessment.id} className="border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{assessment.patientName}</span>
                          <Badge variant="outline" className="text-xs">Completed</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{assessment.diagnosis}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {assessment.updatedAt?.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
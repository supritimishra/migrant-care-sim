import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MigrantAssessment, HealthCamp, User } from '@/types';
import { FileText, Upload, MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PatientDashboardProps {
  user: User;
  assessments: MigrantAssessment[];
  healthCamps: HealthCamp[];
  onCreateAssessment: (assessment: Omit<MigrantAssessment, 'id' | 'createdAt'>) => void;
  onLogout: () => void;
}

const PatientDashboard = ({ user, assessments, healthCamps, onCreateAssessment, onLogout }: PatientDashboardProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    age: '',
    migrantType: '',
    lifestyle: '',
    healthHistory: '',
    symptoms: '',
    bloodTest: {
      hemoglobin: '',
      whiteBloodCells: '',
      platelets: '',
      bloodSugar: '',
      cholesterol: '',
      testDate: ''
    }
  });

  const userAssessments = assessments.filter(a => a.patientId === user.id);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBloodTestChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      bloodTest: { ...prev.bloodTest, [field]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.age || !formData.migrantType || !formData.symptoms) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Generate infectious disease risk assessment
    const riskFactors = [];
    if (formData.symptoms.toLowerCase().includes('fever')) riskFactors.push('fever');
    if (formData.symptoms.toLowerCase().includes('cough')) riskFactors.push('respiratory symptoms');
    if (formData.migrantType === 'refugee') riskFactors.push('crowded living conditions');
    
    const riskLevel = riskFactors.length > 2 ? 'High Risk' : riskFactors.length > 1 ? 'Medium Risk' : 'Low Risk';

    onCreateAssessment({
      patientId: user.id,
      patientName: user.name,
      age: parseInt(formData.age),
      migrantType: formData.migrantType as any,
      lifestyle: formData.lifestyle,
      healthHistory: formData.healthHistory,
      symptoms: formData.symptoms,
      bloodTestResults: formData.bloodTest,
      infectiousDiseaseRisk: riskLevel,
      reportGenerated: true,
      appointmentStatus: 'pending',
      preDiagnosis: `Based on symptoms and risk factors: ${riskLevel} for infectious diseases. Immediate screening recommended.`,
      updatedAt: new Date()
    });

    toast({
      title: "Assessment Submitted",
      description: "Your migrant health report has been generated successfully",
    });

    setFormData({
      age: '',
      migrantType: '',
      lifestyle: '',
      healthHistory: '',
      symptoms: '',
      bloodTest: {
        hemoglobin: '',
        whiteBloodCells: '',
        platelets: '',
        bloodSugar: '',
        cholesterol: '',
        testDate: ''
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Patient Dashboard</h1>
              <p className="text-muted-foreground">Welcome, {user.name}</p>
            </div>
            <Button variant="outline" onClick={onLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assessment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Infectious Disease Risk Assessment
              </CardTitle>
              <CardDescription>
                Complete your assessment for infectious disease prediction and prevention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="migrantType">Migrant Type *</Label>
                    <Select value={formData.migrantType} onValueChange={(value) => handleInputChange('migrantType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seasonal">Seasonal Worker</SelectItem>
                        <SelectItem value="refugee">Refugee</SelectItem>
                        <SelectItem value="worker">Migrant Worker</SelectItem>
                        <SelectItem value="asylum_seeker">Asylum Seeker</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lifestyle">Lifestyle & Living Conditions</Label>
                  <Textarea
                    id="lifestyle"
                    placeholder="Describe your living conditions, work environment, diet, etc."
                    value={formData.lifestyle}
                    onChange={(e) => handleInputChange('lifestyle', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthHistory">Health History</Label>
                  <Textarea
                    id="healthHistory"
                    placeholder="Previous illnesses, medications, allergies, etc."
                    value={formData.healthHistory}
                    onChange={(e) => handleInputChange('healthHistory', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Current Symptoms *</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe any symptoms you're experiencing (e.g., fatigue, breathing problems, pain)"
                    value={formData.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Past Blood Test Results</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
                      <Input
                        id="hemoglobin"
                        value={formData.bloodTest.hemoglobin}
                        onChange={(e) => handleBloodTestChange('hemoglobin', e.target.value)}
                        placeholder="12.0-15.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wbc">White Blood Cells (×10³/μL)</Label>
                      <Input
                        id="wbc"
                        value={formData.bloodTest.whiteBloodCells}
                        onChange={(e) => handleBloodTestChange('whiteBloodCells', e.target.value)}
                        placeholder="4.5-11.0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platelets">Platelets (×10³/μL)</Label>
                      <Input
                        id="platelets"
                        value={formData.bloodTest.platelets}
                        onChange={(e) => handleBloodTestChange('platelets', e.target.value)}
                        placeholder="150-450"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                      <Input
                        id="bloodSugar"
                        value={formData.bloodTest.bloodSugar}
                        onChange={(e) => handleBloodTestChange('bloodSugar', e.target.value)}
                        placeholder="70-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cholesterol">Cholesterol (mg/dL)</Label>
                      <Input
                        id="cholesterol"
                        value={formData.bloodTest.cholesterol}
                        onChange={(e) => handleBloodTestChange('cholesterol', e.target.value)}
                        placeholder="< 200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="testDate">Test Date</Label>
                      <Input
                        id="testDate"
                        type="date"
                        value={formData.bloodTest.testDate}
                        onChange={(e) => handleBloodTestChange('testDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
                  Generate Risk Assessment & Request Appointment
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-6">
            {/* My Reports */}
            <Card>
              <CardHeader>
                <CardTitle>My Assessments & Appointments</CardTitle>
                <CardDescription>{userAssessments.length} assessment(s) completed</CardDescription>
              </CardHeader>
              <CardContent>
                {userAssessments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No assessments yet. Complete the form to generate your first report.</p>
                ) : (
                  <div className="space-y-3">
                    {userAssessments.map((assessment) => (
                      <div key={assessment.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{assessment.migrantType}</Badge>
                            <Badge variant={
                              assessment.appointmentStatus === 'accepted' ? 'default' :
                              assessment.appointmentStatus === 'rejected' ? 'destructive' :
                              assessment.appointmentStatus === 'completed' ? 'default' : 'secondary'
                            }>
                              {assessment.appointmentStatus}
                            </Badge>
                            <Badge variant={
                              assessment.infectiousDiseaseRisk === 'High Risk' ? 'destructive' :
                              assessment.infectiousDiseaseRisk === 'Medium Risk' ? 'secondary' : 'default'
                            }>
                              {assessment.infectiousDiseaseRisk}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {assessment.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm"><strong>Symptoms:</strong> {assessment.symptoms}</p>
                          
                          {assessment.preDiagnosis && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Pre-Diagnosis:</p>
                              <p className="text-sm text-blue-600 dark:text-blue-400">{assessment.preDiagnosis}</p>
                            </div>
                          )}

                          {assessment.diagnosis && (
                            <div className="bg-muted p-3 rounded-md">
                              <p className="text-sm font-medium text-foreground">Doctor's Diagnosis:</p>
                              <p className="text-sm text-muted-foreground">{assessment.diagnosis}</p>
                            </div>
                          )}
                          
                          {assessment.preventiveGoals && (
                            <div className="bg-success/10 p-3 rounded-md">
                              <p className="text-sm font-medium text-success">Prevention Goals:</p>
                              <p className="text-sm text-success/80">{assessment.preventiveGoals}</p>
                            </div>
                          )}

                          {assessment.bloodTestResults.hemoglobin && (
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                              <p className="text-sm font-medium mb-1">Blood Test Analysis:</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <span>Hemoglobin: {assessment.bloodTestResults.hemoglobin}</span>
                                <span>WBC: {assessment.bloodTestResults.whiteBloodCells}</span>
                                <span>Platelets: {assessment.bloodTestResults.platelets}</span>
                                <span>Blood Sugar: {assessment.bloodTestResults.bloodSugar}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Camps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Nearby Health Camps
                </CardTitle>
                <CardDescription>Free health screenings and medical camps for migrants</CardDescription>
              </CardHeader>
              <CardContent>
                {healthCamps.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No health camps scheduled yet.</p>
                ) : (
                  <div className="space-y-3">
                    {healthCamps.map((camp) => (
                      <div key={camp.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{camp.name}</h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {camp.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {camp.date}
                              </div>
                            </div>
                            {camp.description && (
                              <p className="text-sm text-muted-foreground mt-2">{camp.description}</p>
                            )}
                          </div>
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

export default PatientDashboard;
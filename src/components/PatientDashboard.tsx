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
    mriFile: null as File | null
  });

  const userAssessments = assessments.filter(a => a.patientId === user.id);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData(prev => ({ ...prev, mriFile: file || null }));
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

    onCreateAssessment({
      patientId: user.id,
      patientName: user.name,
      age: parseInt(formData.age),
      migrantType: formData.migrantType as any,
      lifestyle: formData.lifestyle,
      healthHistory: formData.healthHistory,
      symptoms: formData.symptoms,
      mriFilename: formData.mriFile?.name,
      reportGenerated: true,
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
      mriFile: null
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
                Migrant Health Assessment
              </CardTitle>
              <CardDescription>
                Complete your health assessment to receive personalized care recommendations
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

                <div className="space-y-2">
                  <Label htmlFor="mri">MRI/Medical Scan Upload</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="mri"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf,.dcm"
                      onChange={handleFileChange}
                    />
                    <Upload className="w-4 h-4 text-muted-foreground" />
                  </div>
                  {formData.mriFile && (
                    <p className="text-sm text-muted-foreground">Selected: {formData.mriFile.name}</p>
                  )}
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
                  Generate Migrant Health Report
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-6">
            {/* My Reports */}
            <Card>
              <CardHeader>
                <CardTitle>My Health Reports</CardTitle>
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
                            {assessment.diagnosis ? (
                              <CheckCircle className="w-4 h-4 text-success" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-accent" />
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {assessment.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm"><strong>Symptoms:</strong> {assessment.symptoms}</p>
                          {assessment.diagnosis && (
                            <div className="bg-muted p-3 rounded-md">
                              <p className="text-sm font-medium text-foreground">Doctor's Diagnosis:</p>
                              <p className="text-sm text-muted-foreground">{assessment.diagnosis}</p>
                            </div>
                          )}
                          {assessment.preventiveGoals && (
                            <div className="bg-success/10 p-3 rounded-md">
                              <p className="text-sm font-medium text-success">Preventive Goals:</p>
                              <p className="text-sm text-success/80">{assessment.preventiveGoals}</p>
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
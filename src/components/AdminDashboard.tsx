import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, MigrantAssessment, HealthCamp } from '@/types';
import { Shield, Plus, Users, MapPin, Calendar, Activity, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  user: User;
  users: User[];
  assessments: MigrantAssessment[];
  healthCamps: HealthCamp[];
  onCreateHealthCamp: (camp: Omit<HealthCamp, 'id'>) => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onLogout: () => void;
}

const AdminDashboard = ({ user, users, assessments, healthCamps, onCreateHealthCamp, onUpdateUser, onLogout }: AdminDashboardProps) => {
  const { toast } = useToast();
  const [isCreateCampOpen, setIsCreateCampOpen] = useState(false);
  const [campForm, setCampForm] = useState({
    name: '',
    location: '',
    date: '',
    description: ''
  });

  const handleCreateCamp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campForm.name || !campForm.location || !campForm.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    onCreateHealthCamp({
      ...campForm,
      createdBy: user.id
    });

    toast({
      title: "Health Camp Created",
      description: `${campForm.name} has been scheduled successfully`,
    });

    setCampForm({ name: '', location: '', date: '', description: '' });
    setIsCreateCampOpen(false);
  };

  const handleDoctorApproval = (doctorId: string, approved: boolean) => {
    onUpdateUser(doctorId, { approved });
    toast({
      title: approved ? "Doctor Approved" : "Doctor Suspended",
      description: `Doctor access has been ${approved ? 'approved' : 'suspended'}`,
    });
  };

  const doctors = users.filter(u => u.role === 'doctor');
  const patients = users.filter(u => u.role === 'patient');
  const completedAssessments = assessments.filter(a => a.diagnosis);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Migrant Health Camp Manager - {user.name}</p>
            </div>
            <Button variant="outline" onClick={onLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold">{patients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Activity className="w-6 h-6 text-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Doctors</p>
                  <p className="text-2xl font-bold">{doctors.filter(d => d.approved !== false).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Completed Cases</p>
                  <p className="text-2xl font-bold">{completedAssessments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Health Camps</p>
                  <p className="text-2xl font-bold">{healthCamps.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Health Camps Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Health Camps Management
                  </CardTitle>
                  <CardDescription>Create and manage migrant health camps</CardDescription>
                </div>
                <Dialog open={isCreateCampOpen} onOpenChange={setIsCreateCampOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-accent">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Camp
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Health Camp</DialogTitle>
                      <DialogDescription>
                        Schedule a new health camp for migrant communities
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleCreateCamp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="campName">Camp Name *</Label>
                        <Input
                          id="campName"
                          value={campForm.name}
                          onChange={(e) => setCampForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Free TB Screening Camp"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={campForm.location}
                          onChange={(e) => setCampForm(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g., Community Health Center"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={campForm.date}
                          onChange={(e) => setCampForm(prev => ({ ...prev, date: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={campForm.description}
                          onChange={(e) => setCampForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Additional details about the camp services"
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsCreateCampOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Create Camp</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {healthCamps.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No health camps created yet</p>
              ) : (
                <div className="space-y-4">
                  {healthCamps.map((camp) => (
                    <div key={camp.id} className="border border-border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{camp.name}</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {camp.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {camp.date}
                        </div>
                        {camp.description && (
                          <p className="mt-2">{camp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Management */}
          <div className="space-y-6">
            {/* Doctor Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Doctor Management
                </CardTitle>
                <CardDescription>Approve and manage doctor access</CardDescription>
              </CardHeader>
              <CardContent>
                {doctors.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No doctors registered yet</p>
                ) : (
                  <div className="space-y-3">
                    {doctors.map((doctor) => (
                      <div key={doctor.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">Migrant Health Specialist</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={doctor.approved !== false ? "default" : "destructive"}>
                            {doctor.approved !== false ? "Approved" : "Suspended"}
                          </Badge>
                          <Switch
                            checked={doctor.approved !== false}
                            onCheckedChange={(checked) => handleDoctorApproval(doctor.id, checked)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Patient Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Overview</CardTitle>
                <CardDescription>Recent patient registrations</CardDescription>
              </CardHeader>
              <CardContent>
                {patients.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No patients registered yet</p>
                ) : (
                  <div className="space-y-3">
                    {patients.slice(0, 5).map((patient) => {
                      const patientAssessments = assessments.filter(a => a.patientId === patient.id);
                      return (
                        <div key={patient.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {patientAssessments.length} assessment(s)
                            </p>
                          </div>
                          <Badge variant="outline">
                            {patientAssessments.some(a => a.diagnosis) ? "Reviewed" : "Pending"}
                          </Badge>
                        </div>
                      );
                    })}
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

export default AdminDashboard;
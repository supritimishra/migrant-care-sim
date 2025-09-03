import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/types';
import { Heart, Stethoscope, Shield } from 'lucide-react';

interface RoleSelectorProps {
  onLogin: (name: string, role: UserRole) => void;
}

const RoleSelector = ({ onLogin }: RoleSelectorProps) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && role) {
      onLogin(name, role as UserRole);
    }
  };

  const roleOptions = [
    { value: 'patient' as UserRole, label: 'Patient (Migrant)', icon: Heart, description: 'Access health assessments and care' },
    { value: 'doctor' as UserRole, label: 'Doctor (Specialist)', icon: Stethoscope, description: 'Review cases and provide diagnosis' },
    { value: 'admin' as UserRole, label: 'Admin (Camp Manager)', icon: Shield, description: 'Manage health camps and users' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Migrant Health System</CardTitle>
          <CardDescription>
            Comprehensive healthcare management for migrant communities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Select Your Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              disabled={!name || !role}
            >
              Access System
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelector;
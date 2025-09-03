import { useState, useEffect } from 'react';
import RoleSelector from '@/components/RoleSelector';
import PatientDashboard from '@/components/PatientDashboard';
import DoctorDashboard from '@/components/DoctorDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import { User, UserRole, MigrantAssessment, HealthCamp, AppState } from '@/types';

const Index = () => {
  const [appState, setAppState] = useState<AppState>({
    currentUser: null,
    users: [],
    assessments: [],
    healthCamps: []
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('migrantHealthData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Convert date strings back to Date objects
        const assessments = parsed.assessments?.map((a: any) => ({
          ...a,
          createdAt: new Date(a.createdAt),
          updatedAt: a.updatedAt ? new Date(a.updatedAt) : undefined
        })) || [];
        
        setAppState({
          ...parsed,
          assessments
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (appState.users.length > 0 || appState.assessments.length > 0 || appState.healthCamps.length > 0) {
      localStorage.setItem('migrantHealthData', JSON.stringify(appState));
    }
  }, [appState]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleLogin = (name: string, role: UserRole) => {
    // Check if user already exists
    let user = appState.users.find(u => u.name === name && u.role === role);
    
    if (!user) {
      user = {
        id: generateId(),
        name,
        role,
        approved: role === 'doctor' ? false : true // Doctors need approval
      };
      
      setAppState(prev => ({
        ...prev,
        users: [...prev.users, user!],
        currentUser: user!
      }));
    } else {
      setAppState(prev => ({
        ...prev,
        currentUser: user!
      }));
    }
  };

  const handleLogout = () => {
    setAppState(prev => ({
      ...prev,
      currentUser: null
    }));
  };

  const handleCreateAssessment = (assessmentData: Omit<MigrantAssessment, 'id' | 'createdAt'>) => {
    const newAssessment: MigrantAssessment = {
      ...assessmentData,
      id: generateId(),
      createdAt: new Date()
    };

    setAppState(prev => ({
      ...prev,
      assessments: [...prev.assessments, newAssessment]
    }));
  };

  const handleUpdateAssessment = (assessmentId: string, updates: Partial<MigrantAssessment>) => {
    setAppState(prev => ({
      ...prev,
      assessments: prev.assessments.map(a => 
        a.id === assessmentId ? { ...a, ...updates } : a
      )
    }));
  };

  const handleCreateHealthCamp = (campData: Omit<HealthCamp, 'id'>) => {
    const newCamp: HealthCamp = {
      ...campData,
      id: generateId()
    };

    setAppState(prev => ({
      ...prev,
      healthCamps: [...prev.healthCamps, newCamp]
    }));
  };

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    setAppState(prev => ({
      ...prev,
      users: prev.users.map(u => 
        u.id === userId ? { ...u, ...updates } : u
      )
    }));
  };

  // Show role selector if no user is logged in
  if (!appState.currentUser) {
    return <RoleSelector onLogin={handleLogin} />;
  }

  // Check if doctor is approved
  if (appState.currentUser.role === 'doctor' && appState.currentUser.approved === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⏳</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Account Pending Approval</h2>
          <p className="text-muted-foreground mb-6">
            Your doctor account is pending approval from the admin. Please wait for approval to access the system.
          </p>
          <button 
            onClick={handleLogout}
            className="text-primary hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  switch (appState.currentUser.role) {
    case 'patient':
      return (
        <PatientDashboard
          user={appState.currentUser}
          assessments={appState.assessments}
          healthCamps={appState.healthCamps}
          onCreateAssessment={handleCreateAssessment}
          onLogout={handleLogout}
        />
      );
    
    case 'doctor':
      return (
        <DoctorDashboard
          user={appState.currentUser}
          assessments={appState.assessments}
          onUpdateAssessment={handleUpdateAssessment}
          onLogout={handleLogout}
        />
      );
    
    case 'admin':
      return (
        <AdminDashboard
          user={appState.currentUser}
          users={appState.users}
          assessments={appState.assessments}
          healthCamps={appState.healthCamps}
          onCreateHealthCamp={handleCreateHealthCamp}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
        />
      );
    
    default:
      return <RoleSelector onLogin={handleLogin} />;
  }
};

export default Index;

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  approved?: boolean;
}

export interface MigrantAssessment {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  migrantType: 'seasonal' | 'refugee' | 'worker' | 'asylum_seeker' | 'other';
  lifestyle: string;
  healthHistory: string;
  symptoms: string;
  bloodTestResults: {
    hemoglobin?: string;
    whiteBloodCells?: string;
    platelets?: string;
    bloodSugar?: string;
    cholesterol?: string;
    testDate?: string;
  };
  infectiousDiseaseRisk: string;
  reportGenerated: boolean;
  diagnosis?: string;
  preventiveGoals?: string;
  preDiagnosis?: string;
  appointmentStatus: 'pending' | 'accepted' | 'rejected' | 'completed';
  doctorId?: string;
  doctorFeedback?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface HealthCamp {
  id: string;
  name: string;
  location: string;
  date: string;
  description: string;
  createdBy: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  assessments: MigrantAssessment[];
  healthCamps: HealthCamp[];
}
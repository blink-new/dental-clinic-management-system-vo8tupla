export interface User {
  id: string
  email: string
  full_name: string
  role: 'super_admin' | 'clinic_manager' | 'doctor' | 'nurse'
  phone?: string
  avatar_url?: string
  is_active: boolean | string | number
  created_at?: string
  updated_at?: string
}

export interface Clinic {
  id: string
  name: string
  address: string
  phone?: string
  email?: string
  manager_id?: string
  description?: string
  is_active: boolean | string | number
  created_at?: string
  updated_at?: string
}

export interface Staff {
  id: string
  user_id: string
  clinic_id: string
  role: 'doctor' | 'nurse'
  specialization?: string
  schedule?: string
  is_active: boolean | string | number
  created_at?: string
  updated_at?: string
}

export interface Patient {
  id: string
  full_name: string
  email?: string
  phone?: string
  date_of_birth?: string
  address?: string
  emergency_contact?: string
  medical_history?: string
  allergies?: string
  insurance_info?: string
  created_at?: string
  updated_at?: string
}

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  clinic_id: string
  appointment_date: string
  appointment_time: string
  duration?: number
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface Treatment {
  id: string
  patient_id: string
  doctor_id: string
  appointment_id?: string
  diagnosis: string
  treatment_plan: string
  medications?: string
  notes?: string
  status: 'active' | 'completed' | 'cancelled'
  cost?: number
  created_at?: string
  updated_at?: string
}

export interface MedicalRecord {
  id: string
  patient_id: string
  doctor_id: string
  visit_date: string
  chief_complaint: string
  examination_findings: string
  diagnosis: string
  treatment_provided: string
  medications_prescribed?: string
  follow_up_instructions?: string
  attachments?: string
  created_at?: string
  updated_at?: string
}

export type UserRole = 'super_admin' | 'clinic_manager' | 'doctor' | 'nurse'

export interface RolePermissions {
  canManageUsers: boolean
  canManageClinics: boolean
  canManageStaff: boolean
  canViewAllPatients: boolean
  canManageAppointments: boolean
  canPrescribeTreatments: boolean
  canViewReports: boolean
  canManageSettings: boolean
}

export const getRolePermissions = (role: UserRole): RolePermissions => {
  switch (role) {
    case 'super_admin':
      return {
        canManageUsers: true,
        canManageClinics: true,
        canManageStaff: true,
        canViewAllPatients: true,
        canManageAppointments: true,
        canPrescribeTreatments: true,
        canViewReports: true,
        canManageSettings: true
      }
    case 'clinic_manager':
      return {
        canManageUsers: false,
        canManageClinics: false,
        canManageStaff: true,
        canViewAllPatients: true,
        canManageAppointments: true,
        canPrescribeTreatments: false,
        canViewReports: true,
        canManageSettings: true
      }
    case 'doctor':
      return {
        canManageUsers: false,
        canManageClinics: false,
        canManageStaff: false,
        canViewAllPatients: true,
        canManageAppointments: true,
        canPrescribeTreatments: true,
        canViewReports: false,
        canManageSettings: false
      }
    case 'nurse':
      return {
        canManageUsers: false,
        canManageClinics: false,
        canManageStaff: false,
        canViewAllPatients: true,
        canManageAppointments: true,
        canPrescribeTreatments: false,
        canViewReports: false,
        canManageSettings: false
      }
    default:
      return {
        canManageUsers: false,
        canManageClinics: false,
        canManageStaff: false,
        canViewAllPatients: false,
        canManageAppointments: false,
        canPrescribeTreatments: false,
        canViewReports: false,
        canManageSettings: false
      }
  }
}
import { useState, useEffect, useCallback } from 'react'
import { blink } from '../blink/client'
import { Sidebar } from './layout/Sidebar'
import { Header } from './layout/Header'
import { DashboardHome } from './pages/DashboardHome'
import { ClinicsPage } from './pages/ClinicsPage'
import { StaffPage } from './pages/StaffPage'
import { PatientsPage } from './pages/PatientsPage'
import { AppointmentsPage } from './pages/AppointmentsPage'
import { TreatmentsPage } from './pages/TreatmentsPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { UserManagementPage } from './pages/UserManagementPage'
import { RoleSelection } from './RoleSelection'

import type { User } from '../types'

interface DashboardProps {
  user: User
}

export function Dashboard({ user }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [userProfile, setUserProfile] = useState<User | null | undefined>(undefined)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const loadUserProfile = useCallback(async () => {
    try {
      // First, try to find existing user by ID (primary key lookup is most reliable)
      const profilesById = await blink.db.users.list({
        where: { id: user.id },
        limit: 1
      })
      
      if (profilesById.length > 0) {
        setUserProfile(profilesById[0])
        return
      }

      // If not found by ID, try by email
      const profilesByEmail = await blink.db.users.list({
        where: { email: user.email },
        limit: 1
      })
      
      if (profilesByEmail.length > 0) {
        setUserProfile(profilesByEmail[0])
        return
      }

      // If no user profile exists, show role selection
      setUserProfile(null)
    } catch (error) {
      console.error('Error loading user profile:', error)
      setUserProfile(null)
    }
  }, [user])

  const handleRoleSelected = (newUserProfile: any) => {
    setUserProfile(newUserProfile)
  }

  useEffect(() => {
    loadUserProfile()
  }, [loadUserProfile])

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome userProfile={userProfile} />
      case 'clinics':
        return <ClinicsPage userProfile={userProfile} />
      case 'staff':
        return <StaffPage userProfile={userProfile} />
      case 'patients':
        return <PatientsPage userProfile={userProfile} />
      case 'appointments':
        return <AppointmentsPage userProfile={userProfile} />
      case 'treatments':
        return <TreatmentsPage userProfile={userProfile} />
      case 'reports':
        return <ReportsPage userProfile={userProfile} />
      case 'settings':
        return <SettingsPage userProfile={userProfile} />
      case 'users':
        return <UserManagementPage userProfile={userProfile} />
      default:
        return <DashboardHome userProfile={userProfile} />
    }
  }

  if (userProfile === null) {
    return <RoleSelection user={user} onRoleSelected={handleRoleSelected} />
  }

  if (userProfile === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        userProfile={userProfile}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="lg:pl-64">
        <Header 
          userProfile={userProfile}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="p-6">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  )
}
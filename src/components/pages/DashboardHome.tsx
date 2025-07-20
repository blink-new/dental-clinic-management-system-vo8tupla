import { useState, useEffect, useCallback } from 'react'
import { blink } from '../../blink/client'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { 
  Users, 
  Calendar, 
  Building2, 
  Stethoscope,
  TrendingUp,
  Clock,
  UserCheck,
  AlertCircle
} from 'lucide-react'

interface DashboardHomeProps {
  userProfile: any
}

export function DashboardHome({ userProfile }: DashboardHomeProps) {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    totalClinics: 0,
    totalStaff: 0,
    pendingTreatments: 0,
    completedToday: 0
  })
  const [recentAppointments, setRecentAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Load statistics based on user role
      const today = new Date().toISOString().split('T')[0]
      
      // Get total patients
      const patients = await blink.db.patients.list({ limit: 1000 })
      
      // Get today's appointments
      const todayAppointments = await blink.db.appointments.list({
        where: { appointmentDate: today },
        limit: 1000
      })
      
      // Get clinics (if user has access)
      let clinics = []
      if (['super_admin', 'clinic_manager'].includes(userProfile?.role)) {
        clinics = await blink.db.clinics.list({ limit: 1000 })
      }
      
      // Get staff
      let staff = []
      if (['super_admin', 'clinic_manager'].includes(userProfile?.role)) {
        staff = await blink.db.staff.list({ limit: 1000 })
      }
      
      // Get treatments
      const treatments = await blink.db.treatments.list({
        where: { status: 'active' },
        limit: 1000
      })
      
      // Get completed treatments today
      const completedToday = await blink.db.treatments.list({
        where: { 
          status: 'completed',
          // Note: SQLite date comparison might need adjustment
        },
        limit: 1000
      })
      
      setStats({
        totalPatients: patients.length,
        todayAppointments: todayAppointments.length,
        totalClinics: clinics.length,
        totalStaff: staff.length,
        pendingTreatments: treatments.length,
        completedToday: completedToday.length
      })
      
      // Get recent appointments for the current user
      let userAppointments = []
      if (userProfile?.role === 'doctor') {
        // Find staff record for this doctor
        const staffRecord = await blink.db.staff.list({
          where: { userId: userProfile.id },
          limit: 1
        })
        
        if (staffRecord.length > 0) {
          userAppointments = await blink.db.appointments.list({
            where: { doctorId: staffRecord[0].id },
            orderBy: { appointmentDate: 'desc' },
            limit: 5
          })
        }
      } else {
        userAppointments = await blink.db.appointments.list({
          orderBy: { appointmentDate: 'desc' },
          limit: 5
        })
      }
      
      setRecentAppointments(userAppointments)
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [userProfile])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getRoleSpecificStats = () => {
    const role = userProfile?.role
    
    if (role === 'super_admin') {
      return [
        { title: 'Total Clinics', value: stats.totalClinics, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Total Staff', value: stats.totalStaff, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
        { title: 'Total Patients', value: stats.totalPatients, icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
        { title: "Today's Appointments", value: stats.todayAppointments, icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' },
      ]
    } else if (role === 'clinic_manager') {
      return [
        { title: 'Staff Members', value: stats.totalStaff, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
        { title: 'Patients', value: stats.totalPatients, icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
        { title: "Today's Appointments", value: stats.todayAppointments, icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' },
        { title: 'Pending Treatments', value: stats.pendingTreatments, icon: Stethoscope, color: 'text-red-600', bg: 'bg-red-100' },
      ]
    } else {
      return [
        { title: "Today's Appointments", value: stats.todayAppointments, icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' },
        { title: 'Pending Treatments', value: stats.pendingTreatments, icon: Stethoscope, color: 'text-red-600', bg: 'bg-red-100' },
        { title: 'Completed Today', value: stats.completedToday, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
        { title: 'Total Patients', value: stats.totalPatients, icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
      ]
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {getGreeting()}, {userProfile?.full_name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-primary-100">
          Here's what's happening at your dental clinic today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getRoleSpecificStats().map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentAppointments.length > 0 ? (
              <div className="space-y-4">
                {recentAppointments.slice(0, 5).map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Patient #{appointment.patientId}</p>
                      <p className="text-sm text-gray-500">
                        {appointment.appointmentDate} at {appointment.appointmentTime}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent appointments</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full p-3 text-left bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <UserCheck className="w-5 h-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Add New Patient</p>
                    <p className="text-sm text-gray-500">Register a new patient</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 text-left bg-accent-50 hover:bg-accent-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-accent mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Schedule Appointment</p>
                    <p className="text-sm text-gray-500">Book a new appointment</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Stethoscope className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Create Treatment</p>
                    <p className="text-sm text-gray-500">Add new treatment plan</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
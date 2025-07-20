import { Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface AppointmentsPageProps {
  userProfile: any
}

export function AppointmentsPage({ userProfile }: AppointmentsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Schedule and manage patient appointments</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Appointment Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
            <p className="text-gray-500 mb-6">Schedule your first patient appointment</p>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
              Schedule Appointment
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
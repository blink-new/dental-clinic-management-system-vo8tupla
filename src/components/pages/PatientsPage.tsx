import { UserCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface PatientsPageProps {
  userProfile: any
}

export function PatientsPage({ userProfile }: PatientsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">Manage patient records and medical history</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="w-5 h-5 mr-2" />
            Patient Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients registered</h3>
            <p className="text-gray-500 mb-6">Start by registering your first patient</p>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
              Add New Patient
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
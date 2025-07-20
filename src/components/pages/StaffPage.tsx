import { Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface StaffPageProps {
  userProfile: any
}

export function StaffPage({ userProfile }: StaffPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage doctors, nurses, and clinic staff</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Staff Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members yet</h3>
            <p className="text-gray-500 mb-6">Add doctors and nurses to your clinic</p>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
              Add Staff Member
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
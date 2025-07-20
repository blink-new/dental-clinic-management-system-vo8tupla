import { Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface ClinicsPageProps {
  userProfile: any
}

export function ClinicsPage({ userProfile }: ClinicsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinics Management</h1>
          <p className="text-gray-600">Manage your dental clinic branches</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Clinic Branches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clinics yet</h3>
            <p className="text-gray-500 mb-6">Start by adding your first clinic branch</p>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
              Add New Clinic
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
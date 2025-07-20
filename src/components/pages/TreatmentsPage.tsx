import { Stethoscope } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface TreatmentsPageProps {
  userProfile: any
}

export function TreatmentsPage({ userProfile }: TreatmentsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Treatments</h1>
          <p className="text-gray-600">Manage treatment plans and prescriptions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Stethoscope className="w-5 h-5 mr-2" />
            Treatment Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No treatments created</h3>
            <p className="text-gray-500 mb-6">Create your first treatment plan</p>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
              Create Treatment
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
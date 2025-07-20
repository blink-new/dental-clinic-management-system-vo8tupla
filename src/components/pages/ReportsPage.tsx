import { BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface ReportsPageProps {
  userProfile: any
}

export function ReportsPage({ userProfile }: ReportsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">View clinic performance and analytics</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Performance Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
            <p className="text-gray-500 mb-6">Reports will appear once you have clinic data</p>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
              Generate Report
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
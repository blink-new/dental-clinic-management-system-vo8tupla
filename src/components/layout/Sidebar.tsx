import { 
  Building2, 
  Users, 
  UserCheck, 
  Calendar, 
  Stethoscope, 
  BarChart3, 
  Settings, 
  Home,
  X
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface SidebarProps {
  userProfile: any
  currentPage: string
  onPageChange: (page: string) => void
  isOpen: boolean
  onToggle: () => void
}

const navigationItems = [
  { id: 'dashboard', label: 'الرئيسية', icon: Home, roles: ['super_admin', 'clinic_manager', 'doctor', 'nurse'] },
  { id: 'users', label: 'إدارة المستخدمين', icon: Users, roles: ['super_admin'] },
  { id: 'clinics', label: 'العيادات', icon: Building2, roles: ['super_admin', 'clinic_manager'] },
  { id: 'staff', label: 'الفريق الطبي', icon: Users, roles: ['super_admin', 'clinic_manager'] },
  { id: 'patients', label: 'المرضى', icon: UserCheck, roles: ['super_admin', 'clinic_manager', 'doctor', 'nurse'] },
  { id: 'appointments', label: 'المواعيد', icon: Calendar, roles: ['super_admin', 'clinic_manager', 'doctor', 'nurse'] },
  { id: 'treatments', label: 'العلاجات', icon: Stethoscope, roles: ['super_admin', 'clinic_manager', 'doctor'] },
  { id: 'reports', label: 'التقارير', icon: BarChart3, roles: ['super_admin', 'clinic_manager'] },
  { id: 'settings', label: 'الإعدادات', icon: Settings, roles: ['super_admin', 'clinic_manager', 'doctor', 'nurse'] },
]

export function Sidebar({ userProfile, currentPage, onPageChange, isOpen, onToggle }: SidebarProps) {
  const userRole = userProfile?.role || 'doctor'
  
  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(userRole)
  )

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Administrator'
      case 'clinic_manager': return 'Clinic Manager'
      case 'doctor': return 'Doctor'
      case 'nurse': return 'Nurse'
      default: return 'User'
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800'
      case 'clinic_manager': return 'bg-blue-100 text-blue-800'
      case 'doctor': return 'bg-green-100 text-green-800'
      case 'nurse': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">DentalCare</h1>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">
                  {userProfile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userProfile?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userProfile?.email}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                getRoleBadgeColor(userRole)
              )}>
                {getRoleDisplayName(userRole)}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id)
                    if (window.innerWidth < 1024) {
                      onToggle()
                    }
                  }}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2024 DentalCare Management
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
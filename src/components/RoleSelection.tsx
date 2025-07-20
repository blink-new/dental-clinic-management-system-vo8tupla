import { useState } from 'react'
import { blink } from '../blink/client'
import type { User, UserRole } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { 
  Shield, 
  Building2, 
  Stethoscope, 
  Heart,
  Users,
  CheckCircle,
  ArrowRight,
  UserPlus
} from 'lucide-react'

interface RoleSelectionProps {
  user: User
  onRoleSelected: (userProfile: User) => void
}

const roles = [
  {
    id: 'super_admin',
    title: 'مدير عام',
    titleEn: 'Super Administrator',
    description: 'إدارة كاملة للنظام وجميع العيادات والمستخدمين',
    descriptionEn: 'Full system management, all clinics and users',
    icon: Shield,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    permissions: [
      'إدارة جميع العيادات',
      'إضافة وحذف المستخدمين',
      'عرض جميع التقارير',
      'إعدادات النظام العامة'
    ]
  },
  {
    id: 'clinic_manager',
    title: 'مدير عيادة',
    titleEn: 'Clinic Manager',
    description: 'إدارة عيادة واحدة والفريق الطبي التابع لها',
    descriptionEn: 'Manage one clinic and its medical team',
    icon: Building2,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    permissions: [
      'إدارة العيادة المخصصة',
      'إدارة الفريق الطبي',
      'جدولة المواعيد',
      'تقارير العيادة'
    ]
  },
  {
    id: 'doctor',
    title: 'طبيب أسنان',
    titleEn: 'Dentist',
    description: 'فحص المرضى ووضع خطط العلاج والمتابعة الطبية',
    descriptionEn: 'Patient examination, treatment planning, and medical follow-up',
    icon: Stethoscope,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    permissions: [
      'فحص المرضى',
      'وضع خطط العلاج',
      'كتابة الوصفات الطبية',
      'متابعة الحالات'
    ]
  },
  {
    id: 'nurse',
    title: 'ممرض/ممرضة',
    titleEn: 'Nurse',
    description: 'مساعدة الأطباء وتنفيذ الإجراءات التمريضية',
    descriptionEn: 'Assist doctors and perform nursing procedures',
    icon: Heart,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    permissions: [
      'مساعدة الأطباء',
      'تحضير المرضى',
      'تنفيذ الإجراءات التمريضية',
      'متابعة المواعيد'
    ]
  }
]

export function RoleSelection({ user, onRoleSelected }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [formData, setFormData] = useState({
    fullName: user.displayName || '',
    phone: '',
    clinicId: ''
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'select' | 'form'>('select')
  const [clinics, setClinics] = useState<any[]>([])

  const handleRoleSelect = async (roleId: string) => {
    setSelectedRole(roleId)
    setStep('form')
    
    // Load clinics if needed for clinic manager, doctor, or nurse
    if (['clinic_manager', 'doctor', 'nurse'].includes(roleId)) {
      try {
        const clinicsList = await blink.db.clinics.list({ limit: 100 })
        setClinics(clinicsList)
      } catch (error) {
        console.error('Error loading clinics:', error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create user profile
      const userProfile = await blink.db.users.create({
        id: user.id,
        email: user.email,
        full_name: formData.fullName,
        role: selectedRole,
        phone: formData.phone,
        is_active: true
      })

      // If it's a staff member (doctor or nurse), create staff record
      if (['doctor', 'nurse'].includes(selectedRole)) {
        await blink.db.staff.create({
          id: `staff_${Date.now()}`,
          user_id: user.id,
          clinic_id: formData.clinicId,
          role: selectedRole,
          specialization: selectedRole === 'doctor' ? 'General Dentistry' : 'Nursing',
          is_active: true
        })
      }

      onRoleSelected(userProfile)
    } catch (error) {
      console.error('Error creating user profile:', error)
      alert('حدث خطأ أثناء إنشاء الملف الشخصي. يرجى المحاولة مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  const selectedRoleData = roles.find(role => role.id === selectedRole)

  if (step === 'form' && selectedRoleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full ${selectedRoleData.bgColor} flex items-center justify-center mb-4`}>
                <selectedRoleData.icon className={`w-8 h-8 ${selectedRoleData.textColor}`} />
              </div>
              <CardTitle className="text-2xl">إكمال التسجيل</CardTitle>
              <p className="text-gray-600">
                تسجيل كـ {selectedRoleData.title}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">الاسم الكامل</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="أدخل رقم هاتفك"
                  />
                </div>

                {['clinic_manager', 'doctor', 'nurse'].includes(selectedRole) && (
                  <div>
                    <Label htmlFor="clinic">العيادة</Label>
                    <select
                      id="clinic"
                      value={formData.clinicId}
                      onChange={(e) => setFormData(prev => ({ ...prev, clinicId: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">اختر العيادة</option>
                      {clinics.map((clinic) => (
                        <option key={clinic.id} value={clinic.id}>
                          {clinic.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('select')}
                    className="flex-1"
                  >
                    رجوع
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'جاري التسجيل...' : 'إكمال التسجيل'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            مرحباً بك في نظام إدارة العيادات
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            اختر دورك في النظام لبدء الاستخدام
          </p>
          <p className="text-gray-500">
            {user.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <Card 
                key={role.id}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full ${role.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 ${role.textColor}`} />
                  </div>
                  <CardTitle className="text-xl mb-2">{role.title}</CardTitle>
                  <p className="text-sm text-gray-500 mb-4">{role.titleEn}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {role.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    <h4 className="font-medium text-gray-900 text-sm">الصلاحيات:</h4>
                    {role.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{permission}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full bg-gradient-to-r ${role.color} hover:opacity-90 transition-opacity`}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    اختيار هذا الدور
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary to-accent text-white">
            <CardContent className="p-8">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">نظام إدارة متكامل</h3>
              <p className="text-primary-100 leading-relaxed">
                نظام شامل لإدارة العيادات الطبية متعددة الفروع مع نظام أدوار متقدم يضمن 
                الأمان والتنظيم الأمثل لجميع العمليات الطبية والإدارية
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
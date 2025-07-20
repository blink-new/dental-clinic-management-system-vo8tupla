import { useState, useEffect, useCallback } from 'react'
import { blink } from '../../blink/client'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Shield,
  Building2,
  Stethoscope,
  Heart,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react'

interface UserManagementPageProps {
  userProfile: any
}

const roleConfig = {
  super_admin: {
    title: 'مدير عام',
    titleEn: 'Super Administrator',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  clinic_manager: {
    title: 'مدير عيادة',
    titleEn: 'Clinic Manager',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  doctor: {
    title: 'طبيب أسنان',
    titleEn: 'Dentist',
    icon: Stethoscope,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  nurse: {
    title: 'ممرض/ممرضة',
    titleEn: 'Nurse',
    icon: Heart,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }
}

export function UserManagementPage({ userProfile }: UserManagementPageProps) {
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showAddUser, setShowAddUser] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [clinics, setClinics] = useState<any[]>([])

  const [newUserForm, setNewUserForm] = useState({
    email: '',
    full_name: '',
    role: 'doctor',
    phone: '',
    clinic_id: ''
  })

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      const usersList = await blink.db.users.list({ 
        orderBy: { created_at: 'desc' },
        limit: 1000 
      })
      setUsers(usersList)
      setFilteredUsers(usersList)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadClinics = useCallback(async () => {
    try {
      const clinicsList = await blink.db.clinics.list({ limit: 100 })
      setClinics(clinicsList)
    } catch (error) {
      console.error('Error loading clinics:', error)
    }
  }, [])

  useEffect(() => {
    loadUsers()
    loadClinics()
  }, [loadUsers, loadClinics])

  useEffect(() => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter])

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newUser = await blink.db.users.create({
        id: `user_${Date.now()}`,
        ...newUserForm,
        is_active: true
      })

      // If it's a staff member, create staff record
      if (['doctor', 'nurse'].includes(newUserForm.role)) {
        await blink.db.staff.create({
          id: `staff_${Date.now()}`,
          user_id: newUser.id,
          clinic_id: newUserForm.clinic_id,
          role: newUserForm.role,
          specialization: newUserForm.role === 'doctor' ? 'General Dentistry' : 'Nursing',
          is_active: true
        })
      }

      setUsers(prev => [newUser, ...prev])
      setShowAddUser(false)
      setNewUserForm({
        email: '',
        full_name: '',
        role: 'doctor',
        phone: '',
        clinic_id: ''
      })
    } catch (error) {
      console.error('Error adding user:', error)
      alert('حدث خطأ أثناء إضافة المستخدم')
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await blink.db.users.update(userId, {
        is_active: !currentStatus
      })
      
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, is_active: !currentStatus }
          : user
      ))
    } catch (error) {
      console.error('Error updating user status:', error)
      alert('حدث خطأ أثناء تحديث حالة المستخدم')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return

    try {
      await blink.db.users.delete(userId)
      setUsers(prev => prev.filter(user => user.id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('حدث خطأ أثناء حذف المستخدم')
    }
  }

  const getRoleStats = () => {
    const stats = {
      total: users.length,
      super_admin: users.filter(u => u.role === 'super_admin').length,
      clinic_manager: users.filter(u => u.role === 'clinic_manager').length,
      doctor: users.filter(u => u.role === 'doctor').length,
      nurse: users.filter(u => u.role === 'nurse').length,
      active: users.filter(u => Number(u.is_active) > 0).length
    }
    return stats
  }

  const stats = getRoleStats()

  if (userProfile?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h2>
        <p className="text-gray-600">هذه الصفحة متاحة للمدير العام فقط</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p className="text-gray-600 mt-1">إدارة جميع مستخدمي النظام وصلاحياتهم</p>
        </div>
        <Button onClick={() => setShowAddUser(true)} className="bg-primary hover:bg-primary/90">
          <UserPlus className="w-4 h-4 mr-2" />
          إضافة مستخدم جديد
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مديرين عامين</p>
                <p className="text-2xl font-bold">{stats.super_admin}</p>
              </div>
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مديري عيادات</p>
                <p className="text-2xl font-bold">{stats.clinic_manager}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">أطباء</p>
                <p className="text-2xl font-bold">{stats.doctor}</p>
              </div>
              <Stethoscope className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ممرضين</p>
                <p className="text-2xl font-bold">{stats.nurse}</p>
              </div>
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">نشطين</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث بالاسم أو البريد الإلكتروني..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">جميع الأدوار</option>
                <option value="super_admin">مدير عام</option>
                <option value="clinic_manager">مدير عيادة</option>
                <option value="doctor">طبيب أسنان</option>
                <option value="nurse">ممرض/ممرضة</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المستخدمين ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد مستخدمين</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const roleInfo = roleConfig[user.role as keyof typeof roleConfig]
                const Icon = roleInfo?.icon || Users
                const isActive = Number(user.is_active) > 0

                return (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full ${roleInfo?.bgColor || 'bg-gray-100'} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${roleInfo?.color || 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.full_name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleInfo?.bgColor} ${roleInfo?.color}`}>
                            {roleInfo?.title || user.role}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isActive ? 'نشط' : 'غير نشط'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleUserStatus(user.id, isActive)}
                      >
                        {isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {user.id !== userProfile.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>إضافة مستخدم جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="full_name">الاسم الكامل</Label>
                  <Input
                    id="full_name"
                    type="text"
                    value={newUserForm.full_name}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, full_name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="role">الدور</Label>
                  <select
                    id="role"
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="doctor">طبيب أسنان</option>
                    <option value="nurse">ممرض/ممرضة</option>
                    <option value="clinic_manager">مدير عيادة</option>
                    <option value="super_admin">مدير عام</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                {['clinic_manager', 'doctor', 'nurse'].includes(newUserForm.role) && (
                  <div>
                    <Label htmlFor="clinic_id">العيادة</Label>
                    <select
                      id="clinic_id"
                      value={newUserForm.clinic_id}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, clinic_id: e.target.value }))}
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
                    onClick={() => setShowAddUser(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" className="flex-1">
                    إضافة المستخدم
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
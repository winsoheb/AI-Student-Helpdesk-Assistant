import AdminCrudPage from '@/components/AdminCrudPage';

export default function Page() {
  return (
    <AdminCrudPage 
      title="Student Management"
      description="Add and manage student accounts"
      endpoint="api/v1/admin/students"
      formSchema={[{ name: 'name', label: 'Full Name', type: 'text' },
        { name: 'department_id', label: 'Department', type: 'select', endpoint: 'api/v1/admin/departments' },
        { name: 'course_id', label: 'Course', type: 'select', endpoint: 'api/v1/admin/courses' },
        { name: 'semester', label: 'Semester', type: 'number' },
        { name: 'year', label: 'Admission Year (e.g. 2024)', type: 'number' }]}
    />
  );
}

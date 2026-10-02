import AdminCrudPage from '@/components/AdminCrudPage';

export default function Page() {
  return (
    <AdminCrudPage 
      title="Subjects"
      description="Manage course subjects"
      endpoint="api/v1/admin/subjects"
      formSchema={[{ name: 'name', label: 'Subject Name', type: 'text' },
        { name: 'code', label: 'Subject Code', type: 'text' },
        { name: 'course_id', label: 'Course', type: 'select', endpoint: 'api/v1/admin/courses' },
        { name: 'semester', label: 'Semester', type: 'number' }]}
    />
  );
}

import AdminCrudPage from '@/components/AdminCrudPage';

export default function Page() {
  return (
    <AdminCrudPage 
      title="Departments"
      description="Manage College Departments"
      endpoint="api/v1/admin/departments"
      formSchema={[{ name: 'name', label: 'Department Name', type: 'text' },
        { name: 'code', label: 'Department Code', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' }]}
    />
  );
}

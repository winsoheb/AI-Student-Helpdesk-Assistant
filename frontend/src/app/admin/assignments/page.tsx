import AdminCrudPage from '@/components/AdminCrudPage';

export default function Page() {
  return (
    <AdminCrudPage 
      title="Assignments"
      description="Post new assignments for students"
      endpoint="api/v1/admin/assignments"
      formSchema={[{ name: 'title', label: 'Assignment Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'subject_id', label: 'Subject', type: 'select', endpoint: 'api/v1/admin/subjects' },
        { name: 'due_date', label: 'Due Date', type: 'date' },
        { name: 'marks', label: 'Maximum Marks', type: 'number' }]}
    />
  );
}

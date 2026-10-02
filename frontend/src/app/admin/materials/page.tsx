import AdminCrudPage from '@/components/AdminCrudPage';

export default function Page() {
  return (
    <AdminCrudPage 
      title="Study Materials"
      description="Upload study materials (PDF/DOCX) for the AI"
      endpoint="api/v1/admin/materials"
      formSchema={[{ name: 'title', label: 'Material Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'subject_id', label: 'Subject', type: 'select', endpoint: 'api/v1/admin/subjects' },
        { name: 'file', label: 'Document File (PDF/DOCX)', type: 'file' }]}
    />
  );
}

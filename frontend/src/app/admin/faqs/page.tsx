import AdminCrudPage from '@/components/AdminCrudPage';

export default function Page() {
  return (
    <AdminCrudPage 
      title="FAQs"
      description="Manage Frequently Asked Questions for the AI Assistant"
      endpoint="api/v1/admin/faqs"
      formSchema={[{ name: 'question', label: 'Question', type: 'text' },
        { name: 'answer', label: 'Answer', type: 'textarea' }]}
    />
  );
}

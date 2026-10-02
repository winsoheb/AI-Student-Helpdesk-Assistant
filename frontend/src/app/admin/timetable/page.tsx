import AdminCrudPage from '@/components/AdminCrudPage';

export default function Page() {
  return (
    <AdminCrudPage 
      title="Class Timetable"
      description="Manage the weekly class schedule"
      endpoint="api/v1/admin/timetable"
      formSchema={[{ name: 'course_id', label: 'Course', type: 'select', endpoint: 'api/v1/admin/courses' },
        { name: 'subject_id', label: 'Subject', type: 'select', endpoint: 'api/v1/admin/subjects' },
        { name: 'semester', label: 'Semester', type: 'number' },
        { name: 'weekday', label: 'Weekday', type: 'select', options: [{value:'Monday',label:'Monday'},{value:'Tuesday',label:'Tuesday'},{value:'Wednesday',label:'Wednesday'},{value:'Thursday',label:'Thursday'},{value:'Friday',label:'Friday'},{value:'Saturday',label:'Saturday'}] },
        { name: 'start_time', label: 'Start Time (HH:MM)', type: 'time' },
        { name: 'end_time', label: 'End Time (HH:MM)', type: 'time' },
        { name: 'faculty', label: 'Faculty Name', type: 'text' },
        { name: 'room', label: 'Classroom', type: 'text' }]}
    />
  );
}

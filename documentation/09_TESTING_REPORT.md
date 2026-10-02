# Chapter 9: Testing

| Test ID | Test Scenario | Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC_01 | Admin Login | admin/admin | Redirect to Admin Dashboard | Redirected successfully | Passed |
| TC_02 | Student Login | 2023MBA001/pass | Redirect to Student Portal | Redirected successfully | Passed |
| TC_03 | Upload Study Material | Valid PDF File | File saved, AI chunks generated | File saved in uploads, chunks in DB | Passed |
| TC_04 | Add Student | Name, Dept, Year | Auto-generated Roll Number & User Account | 2024CS001 created | Passed |
| TC_05 | AI Query (Schedule) | "What is my timetable?" | Returns SQL timetable data | Returned structured timetable | Passed |
| TC_06 | AI Query (Material) | "What is a static variable" | Returns paragraph from PDF via TF-IDF | Returned correct chunk avoiding TOC | Passed |
| TC_07 | AI Query (Unknown) | "Gibberish" | Returns "I couldn't find verified info" | Fallback triggered | Passed |
| TC_08 | Unauthorized Access | Student hits `/admin/students` | 403 Unauthorized | 403 Returned | Passed |
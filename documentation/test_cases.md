# Test Cases

| Test Case ID | Module | Scenario | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC-01 | Auth | Admin Login with valid credentials | Navigates to `/admin/dashboard` | Pass |
| TC-02 | Auth | Student Login with invalid credentials | Flashes "Invalid username or password" | Pass |
| TC-03 | Admin | Add new Department via modal | DB updates and table row appears | Pass |
| TC-04 | Admin | Upload PDF Study Material | File saved, text chunked into DB | Pass |
| TC-05 | Admin | Upload unsupported file (e.g., `.exe`) | Flashes error, upload blocked | Pass |
| TC-06 | Chatbot | Ask "Show my timetable" | Intent classified as `TIMETABLE`, SQL query executed | Pass |
| TC-07 | Chatbot | Ask non-college general question | Fails TF-IDF threshold, returns fallback msg | Pass |
| TC-08 | Packaging | Run packaged `.exe` on clean Windows | Waitress starts, opens browser, works without Python | Pending |

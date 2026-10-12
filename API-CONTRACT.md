# EMSmainbackend API mapping used by the frontend

Base URL from the supplied Visual Studio HTTPS launch profile: `https://localhost:7276/api`

| Feature | Method | Route | UI operation |
|---|---|---|---|
| Auth | POST | `/Aauth/login` | Sign in |
| Auth | POST | `/Aauth/register` | Employee registration |
| Employees | GET | `/Employee` | List employees |
| Employees | GET | `/Employee/{id}` | Employee detail service |
| Employees | POST | `/Employee` | Add employee (Admin) |
| Employees | PUT | `/Employee/{id}` | Edit employee (Admin) |
| Employees | DELETE | `/Employee/{id}` | Delete employee (Admin) |
| Departments | GET | `/Department` | List departments |
| Departments | GET | `/Department/{id}` | Department detail service |
| Departments | POST | `/Department` | Add department (Admin) |
| Departments | PUT | `/Department/{id}` | Edit department (Admin) |
| Departments | DELETE | `/Department/{id}` | Delete department (Admin) |
| Attendance | GET | `/Attendance` | List attendance |
| Attendance | GET | `/Attendance/{id}` | Attendance detail service |
| Attendance | GET | `/Attendance/employee/{employeeId}` | Employee attendance service |
| Attendance | POST | `/Attendance` | Add attendance (Admin) |
| Attendance | PUT | `/Attendance/{id}` | Edit attendance (Admin) |
| Attendance | DELETE | `/Attendance/{id}` | Delete attendance (Admin) |
| Leave | GET | `/Leave` | List leave requests |
| Leave | GET | `/Leave/{id}` | Leave detail service |
| Leave | GET | `/Leave/employee/{employeeId}` | Employee leave service |
| Leave | POST | `/Leave` | Submit leave request |
| Leave | PUT | `/Leave/{id}/status` | Approve/reject (Admin; JSON string body) |
| Leave | DELETE | `/Leave/{id}` | Delete leave request (Admin) |
| Payroll | GET | `/Payroll` | List payroll |
| Payroll | GET | `/Payroll/{id}` | Payroll detail service |
| Payroll | GET | `/Payroll/employee/{employeeId}` | Employee payroll service |
| Payroll | POST | `/Payroll` | Create payroll |
| Payroll | PUT | `/Payroll/{id}` | Edit payroll |
| Payroll | DELETE | `/Payroll/{id}` | Delete payroll |
| Performance | GET | `/Performance` | List reviews |
| Performance | GET | `/Performance/{id}` | Review detail service |
| Performance | GET | `/Performance/employee/{employeeId}` | Employee review service |
| Performance | POST | `/Performance` | Add review (Admin) |
| Performance | PUT | `/Performance/{id}` | Edit review |
| Performance | DELETE | `/Performance/{id}` | Delete review |
| Notifications | GET | `/Notification` | Current user's notifications |
| Notifications | PUT | `/Notification/{id}/read` | Mark notification read |
| Dashboard | GET | `/Dashboard/summary` | Dashboard summary |
| Reports | GET | `/Report/summary` | Report summary |

Protected requests attach `Authorization: Bearer <JWT>` automatically. The backend's CORS policy permits `http://localhost:5173`.

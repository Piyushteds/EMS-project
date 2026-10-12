# EMS Pro — Industrial Frontend

A responsive React + Vite frontend following Atomic Design (atoms, molecules, organisms, templates and pages). It connects directly to the supplied `EMSmainbackend` ASP.NET Core API; no backend files are included or modified.

## Requirements
- Node.js 20.19+ or 22.12+
- npm
- The existing EMS backend running in Visual Studio

## Run
1. Start `EMSmainbackend` in Visual Studio using its HTTPS profile. The supplied launch settings use `https://localhost:7276` and `http://localhost:5196`.
2. In this folder, confirm `.env` contains:
   ```env
   VITE_API_BASE_URL=https://localhost:7276/api
   VITE_USE_API=true
   ```
   The backend CORS policy allows `http://localhost:5173`.
3. Open a terminal in this folder and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the Vite URL, normally `http://localhost:5173`.

If the browser reports a local HTTPS certificate error, run this in an elevated/normal PowerShell as appropriate and restart the backend:
```powershell
dotnet dev-certs https --trust
```

## Backend integration notes
- Authentication uses the actual controller route `/api/Aauth/login` and `/api/Aauth/register` (the controller class in the supplied backend is `AauthController`).
- The HTTP client automatically attaches `Authorization: Bearer <token>` to protected API requests.
- Leave status updates send a JSON string (`"Approved"` or `"Rejected"`) because the backend action binds `[FromBody] string status`.
- Employee, department and attendance create/update/delete controls are shown to Admin users where the backend enforces the Admin role. Leave requests are available to signed-in users; approval/deletion controls are Admin-only. Payroll and performance actions follow the actual controller attributes.
- Payroll payment status is read-only in the UI because the supplied API has no separate payment-status action and the create/update DTOs do not accept that field.
- The frontend uses only backend-returned data. It does not seed fake employees or silently fall back to demo credentials.

## Build
```bash
npm run build
npm run preview
```

### Initial administrator account
The UI intentionally registers public sign-ups as `Employee`. To bootstrap an Admin account, use the existing Swagger `POST /api/Aauth/register` endpoint with the backend's `RegisterDto` and `role: "Admin"`, then sign in through the UI. This follows the backend as supplied; no backend changes are made here.

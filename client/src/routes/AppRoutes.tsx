import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import AuthLayout from "../layouts/authLayout";
import DashboardLayout from "../layouts/DashBoardLayout";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Patients from "../pages/Patients";
import Images from "../pages/Images";
import Staff from "../pages/Staff";
import Reports from "../pages/Reports";
import Appointments from "../pages/Appointments";
import Surgeries from "../pages/Surgeries";
import Settings from "../pages/Settings";
import CreatePatient from "../pages/CreatePatient";
import ProtectedRoute from "../components/ProtectedRoute";
import Registration from "../pages/Register";
import ViewPatient from "../pages/ViewPatient";
import MedicalReport from "../pages/MedicalReport";
import UpdatePatientData from "../pages/UpdatePatientData";
import Prescription from "../pages/Prescription";
import PatientImages from "../pages/PatientImages";


const AppRoutes = () => {
  return (
    <Routes>
      {/* default app entry */}
      <Route path="/" element={<Navigate to="/register" replace/>}/>

      {/* *Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/register" element={<Registration/>}/>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* *Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/create" element={<CreatePatient />} />
          <Route path="images" element={<Images />} />
          <Route path="patients/medicalReport/:patientId" element={<MedicalReport />} />
          <Route path="patients/prescriptions/:patientId" element={<Prescription/>}/>
          <Route path="patients/appointments" element={<Appointments />} />
          <Route path="patients/updatePatientData/:patientId" element={<UpdatePatientData/>}/>
          <Route path="surgeries" element={<Surgeries />} />
          <Route path="staffs" element={<Staff />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="patients/:patientId" element={<ViewPatient />} />
          <Route path="patients/images/:patientId" element={<PatientImages/>}/>
        </Route>
      </Route>
      {/* * Global fallback */}
      <Route path="*" element={<Navigate to="/" replace />}/>

    </Routes>
  );
};
export default AppRoutes;

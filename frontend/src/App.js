import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from './components/layouts/MainLayout';
import Dashboard from './pages/UserPanel/Dashboard/Dashboard'; 
import PlanningPage from './pages/UserPanel/Plan/PlanningPage';
import SubmissionPortal from './pages/UserPanel/SubmissionPortal/SubmissionPortal';
import ActivityArchive from './pages/Archive/ActivityArchive';
import FacultyRanking from './pages/Faculty/FacultyRank/FacultyRanking';
import ReportGenerator from './pages/UserPanel/ReportGenerator/ReportGenerator'; 
import LoginPage from './pages/Auth/Login/Login';
import AnalyticsPage from './pages/AdminPanel/Analytics/AnalyticsPage';
import AdminPanel from './pages/AdminPanel/Dashboard/AdminPanel';
import VerificationAudit from './pages/AdminPanel/Verification/VerificationPage';
import StaffManagement from './pages/AdminPanel/StaffManagement/StaffManagement';
import AdminLayout from './components/layouts/AdminLayout';
import TaxonomySettings from './pages/AdminPanel/TaxonomySettings/TaxonomySettings';
import AssetManagement from './pages/AdminPanel/AssetManagement/AssetManagement';
import FacultyRank from './pages/AdminPanel/Faculty/Faculty';
import DeanDashboard from './pages/AdminPanel/DeanDashboard/DeanDashboard';
import KpiPlanningView from './pages/UserPanel/KpiPlanningView/KpiPlanningView';
import StaffDeadlineMonitor from './pages/AdminPanel/StaffDeadlineMonitor/StaffDeadlineMonitor';
import ApiLogsMonitor from './pages/AdminPanel/Logs/ApiLogsMonitor';
import LdapManagement from './pages/AdminPanel/LdapManagement/LdapManagement';
import ChatAI from './pages/UserPanel/Chat/ChatAI';



const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Список ролей, имеющих доступ к админ-панели (контроль и верификация)
  const adminRoles = ['super_admin', 'academic_office', 'dean', 'head_of_dept'];

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    const hasAdminAccess = adminRoles.includes(user.role);
    
    if (!hasAdminAccess) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="audit" replace />} />

          <Route path="audit" element={<VerificationAudit />} />
          
          <Route path="assets" element={<AssetManagement />} />
          <Route path="monitor" element={<StaffDeadlineMonitor />} />
          <Route path="dashboard" element={<AdminPanel />} />
          <Route path="dean" element={<DeanDashboard />} />
          <Route path="logs" element={<ApiLogsMonitor />} />
          <Route path="settings" element={<TaxonomySettings />} />
          <Route path="faculties" element={<FacultyRank />} />
          <Route path="users" element={<StaffManagement />} />
          <Route path="users/ldap" element={<LdapManagement />} />
        </Route>

        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="plan" element={<PlanningPage />} />
          <Route path="view" element={<KpiPlanningView />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="chat" element={<ChatAI />} />
          <Route path="submit" element={<SubmissionPortal />} />
          <Route path="archive" element={<ActivityArchive />} />
          <Route path="rating" element={<FacultyRanking />} />
          <Route path="report" element={<ReportGenerator />} />
        </Route>

        <Route path="*" element={<div className="p-10 text-center font-bold">Страница не найдена</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
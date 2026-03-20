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
import AuditLog from './pages/AdminPanel/AuditLog/AuditLog';
import AssetManagement from './pages/AdminPanel/AssetManagement/AssetManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminPanel />} />
          <Route path="audit" element={<VerificationAudit />} />
          <Route path="assets" element={<AssetManagement />} />
          <Route path="log" element={<AuditLog />} />
          <Route path="settings" element={<TaxonomySettings />} />
          <Route path="users" element={<StaffManagement />} />
        </Route>
        <Route path="/" element={<MainLayout />}>
          
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="plan" element={<PlanningPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="submit" element={<SubmissionPortal />} />
          <Route path="archive" element={<ActivityArchive />} />
          <Route path="rating" element={<FacultyRanking />} />
          <Route path="report" element={<ReportGenerator />} />

          <Route path="*" element={<div className="p-10 text-center font-bold">Страница не найдена</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
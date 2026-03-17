import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from './components/layouts/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard'; 
import PlanningPage from './pages/UserPanel/Plan/PlanningPage';
import SubmissionPortal from './pages/SubmissionPortal/SubmissionPortal';
import ActivityArchive from './pages/Archive/ActivityArchive';
import FacultyRanking from './pages/Faculty/FacultyRank/FacultyRanking';
import ReportGenerator from './pages/ReportGenerator/ReportGenerator'; // Не забудьте импорт
import LoginPage from './pages/Auth/Login/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainLayout />}>
          
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="plan" element={<PlanningPage />} />
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
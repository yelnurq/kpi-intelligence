import React from 'react';
import './App.css';
import MainLayout from './components/layouts/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard'; 
import PlanningPage from './pages/Plan/PlanningPage';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import SubmissionPortal from './pages/SubmissionPortal/SubmissionPortal';
import ActivityArchive from './pages/Archive/ActivityArchive';
import FacultyRanking from './pages/Faculty/FacultyRank/FacultyRanking';

function App() {
  return (
    <MainLayout>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Dashboard/>}></Route>
            <Route path='/plan' element={<PlanningPage/>}></Route>
            <Route path='/portal' element={<SubmissionPortal/>}></Route>
            <Route path='/archive' element={<ActivityArchive/>}></Route>
            <Route path='/rank' element={<FacultyRanking/>}></Route>
          </Routes>
      </BrowserRouter>
      {/* Рендерим Дашборд как children внутри лейаута */}
    </MainLayout>
  );
}

export default App;
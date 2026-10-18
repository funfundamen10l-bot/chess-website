import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";
import PortalLayout from "./components/portal/PortalLayout";
import DashboardPage from "./pages/portal/DashboardPage";
import StudentsPage from "./pages/portal/StudentsPage";
import BatchesPage from "./pages/portal/BatchesPage";
import AttendancePage from "./pages/portal/AttendancePage";
import FeesPage from "./pages/portal/FeesPage";
import PerformancePage from "./pages/portal/PerformancePage";
import CommunicationsPage from "./pages/portal/CommunicationsPage";
import StudentDetailPage from "./pages/portal/StudentDetailPage";
import TournamentsPage from "./pages/portal/TournamentsPage";
import BatchCalendarPage from "./pages/portal/BatchCalendarPage";
import "./App.css";

const TOAST_STYLE = {
  background: '#0A0A0A',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff'
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/portal" element={<PortalLayout><DashboardPage /></PortalLayout>} />
          <Route path="/portal/students" element={<PortalLayout><StudentsPage /></PortalLayout>} />
          <Route path="/portal/batches" element={<PortalLayout><BatchesPage /></PortalLayout>} />
          <Route path="/portal/attendance" element={<PortalLayout><AttendancePage /></PortalLayout>} />
          <Route path="/portal/batch-calendar" element={<PortalLayout><BatchCalendarPage /></PortalLayout>} />
          <Route path="/portal/fees" element={<PortalLayout><FeesPage /></PortalLayout>} />
          <Route path="/portal/performance" element={<PortalLayout><PerformancePage /></PortalLayout>} />
          <Route path="/portal/communications" element={<PortalLayout><CommunicationsPage /></PortalLayout>} />
          <Route path="/portal/students/:studentId" element={<PortalLayout><StudentDetailPage /></PortalLayout>} />
          <Route path="/portal/tournaments" element={<PortalLayout><TournamentsPage /></PortalLayout>} />
        </Routes>
      </BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{ style: TOAST_STYLE }}
      />
    </div>
  );
}

export default App;

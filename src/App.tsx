import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SimulationProvider } from './context/SimulationContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ToastContainer } from './components/common/Toast';
import { ReportFloodingModal } from './components/citizen/ReportFloodingModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { CitizenHome } from './pages/citizen/CitizenHome';
import { CitizenMap } from './pages/citizen/CitizenMap';
import { CitizenForecast } from './pages/citizen/CitizenForecast';
import { CitizenAlerts } from './pages/citizen/CitizenAlerts';
import { CitizenRoutes } from './pages/citizen/CitizenRoutes';
import { AuthorityDashboard } from './pages/authority/AuthorityDashboard';
import { AuthorityMap } from './pages/authority/AuthorityMap';
import { AuthorityForecast } from './pages/authority/AuthorityForecast';
import { AuthorityAlerts } from './pages/authority/AuthorityAlerts';
import { AuthorityDrainage } from './pages/authority/AuthorityDrainage';
import { AuthorityRiskAnalysis } from './pages/authority/AuthorityRiskAnalysis';
import { AuthoritySimulation } from './pages/authority/AuthoritySimulation';
import { AuthorityHistory } from './pages/authority/AuthorityHistory';
import { SettingsPage } from './pages/SettingsPage';

const AppRouter: React.FC = () => {
  const { currentPath, currentRole, sidebarCollapsed } = useApp();

  const renderCurrentPage = () => {
    switch (currentPath) {
      // Public
      case '/':
        return <LandingPage />;
      case '/role-selection':
        return <RoleSelectionPage />;

      // Citizen
      case '/citizen':
        return <CitizenHome />;
      case '/citizen/map':
        return <CitizenMap />;
      case '/citizen/forecast':
        return <CitizenForecast />;
      case '/citizen/alerts':
        return <CitizenAlerts />;
      case '/citizen/routes':
        return <CitizenRoutes />;

      // Authority
      case '/authority':
        return <AuthorityDashboard />;
      case '/authority/map':
        return <AuthorityMap />;
      case '/authority/forecast':
        return <AuthorityForecast />;
      case '/authority/alerts':
        return <AuthorityAlerts />;
      case '/authority/drainage':
        return <AuthorityDrainage />;
      case '/authority/risk-analysis':
        return <AuthorityRiskAnalysis />;
      case '/authority/simulation':
        return <AuthoritySimulation />;
      case '/authority/history':
        return <AuthorityHistory />;

      // Common
      case '/settings':
        return <SettingsPage />;

      // Default fallback
      default:
        if (currentPath.startsWith('/citizen')) return <CitizenHome />;
        if (currentPath.startsWith('/authority')) return <AuthorityDashboard />;
        return <LandingPage />;
    }
  };

  const isPublic = currentPath === '/' || currentPath === '/role-selection';
  const isAuthority = currentRole === 'authority' && !isPublic;

  if (isPublic) {
    return (
      <div className="min-h-screen bg-command-950 text-slate-100">
        {renderCurrentPage()}
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-command-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar />

      <div className="flex-1 flex">
        {/* Authority Persistent Sidebar on desktop */}
        {isAuthority && <Sidebar />}

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isAuthority
              ? sidebarCollapsed
                ? 'lg:pl-20 p-4 sm:p-6 max-w-full'
                : 'lg:pl-68 p-4 sm:p-6 max-w-full'
              : 'max-w-7xl mx-auto w-full p-4 sm:p-6'
          }`}
        >
          {renderCurrentPage()}
        </main>
      </div>

      {/* Citizen Crowdsource Flood Modal */}
      <ReportFloodingModal />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Toast Feedback Notifications */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <SimulationProvider>
        <AppRouter />
      </SimulationProvider>
    </AppProvider>
  );
};

export default App;

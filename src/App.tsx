import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import ClientFormPage from './pages/ClientFormPage';
import EstimateFormPage from './pages/EstimateFormPage';
import EstimateSummaryPage from './pages/EstimateSummaryPage';
import DataView from './pages/DataView';
import BudgetSimulationPage from './pages/BudgetSimulationPage';
import EstimatePreviewPage from './pages/EstimatePreviewPage';
import ClientManagePage from './pages/ClientManagePage';
import EstimateManagePage from './pages/EstimateManagePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/clients" element={<ClientManagePage />} />
            <Route path="/clients/new" element={<ClientFormPage />} />
            <Route path="/clients/:clientId" element={<ClientFormPage />} />
            <Route path="/estimates" element={<EstimateManagePage />} />
            <Route path="/estimates/new" element={<EstimateFormPage />} />
            <Route path="/estimates/:estimateId/summary" element={<EstimateSummaryPage />} />
            <Route path="/data" element={<DataView />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/budget-simulation" element={<BudgetSimulationPage />} />
            <Route path="/estimate-preview" element={<EstimatePreviewPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
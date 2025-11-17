import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from './components/layout/layout';
import Home from './pages/home';
import { EnergyConsumptionChart } from './pages/chartPOC';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<EnergyConsumptionChart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
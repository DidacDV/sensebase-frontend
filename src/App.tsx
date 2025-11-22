import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from './components/layout/layout';
import Home from './pages/home';
import EnergyDashboard  from '@src/pages/chartPOC';
import BoardPage from '@src/pages/board/board';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<EnergyDashboard />} />
          <Route path="/board" element={<BoardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
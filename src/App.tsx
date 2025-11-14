import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from './components/layout/layout';
import Home from './pages/home';
import { ChartsPOC } from './pages/chartPOC';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tariff" element={<ChartsPOC />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from './components/layout/layout';
import Home from './pages/home';
import BoardPage from '@src/pages/board/board';
import NewBoard from "@src/pages/new-board";
import LoginPage from "@src/pages/login";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BoardsListPage from "@src/pages/yourBoards";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});
function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/boards/new" element={<NewBoard />} />
                <Route path="/boards/:id" element={<BoardPage />} />
                <Route path="/boards" element={<BoardsListPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
  );
}

export default App;
// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layout/AppLayout";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Логин */}
        <Route path="/" element={<LoginPage />} />

        {/* Все внутренние страницы */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
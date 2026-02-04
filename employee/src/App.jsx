import React, { useEffect } from "react";
import { useThemeStore } from "./store/ThemeStore";
import { Route, Routes } from "react-router";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import { useEmployee } from "./store/useEmlpoyee";
import SettingsPage from "./components/settings";

const App = () => {
  const { employee, checkAuth, user } = useEmployee();
  const { theme } = useThemeStore();
  

  useEffect(() => {
    if(!employee){
      checkAuth();
    }
  }, [user]);
  return (
    <div data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={!employee ? <Login /> : <EmployeeDashboard />}
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
};

export default App;

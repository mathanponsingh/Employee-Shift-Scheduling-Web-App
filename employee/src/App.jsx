import React, { useEffect } from "react";
import { useThemeStore } from "./store/ThemeStore";
import { Route, Routes } from "react-router";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import { useEmployee } from "./store/useEmlpoyee";
import SettingsPage from "./components/settings";
import { Toaster} from 'react-hot-toast'
const App = () => {
  const { employee, checkAuth, user } = useEmployee();
  const { theme } = useThemeStore();
  

  useEffect(() => {
    if(!employee){
      checkAuth();
    }
  }, []);
  return (
    <div data-theme={theme}>
      <Toaster/>
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

import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Employee from "./Pages/Employee";
import Schedule from "./Pages/Schedule";
import Login from "./Pages/Login";
import Settings from "./Pages/Settings";
import { useThemeStore } from "./store/ThemeStore";
import { UseEmployeeStore } from "./store/StateManager";
import {Toaster} from 'react-hot-toast'

const App = () => {
  const { theme } = useThemeStore();
  const { admin, checkAuth } =  UseEmployeeStore();
  
  useEffect(()=>{
    checkAuth()
  },[])
    
  return (
    <div data-theme={theme}>
      <Toaster />
      <Routes>
        <Route
          path="/login"
          element={!admin ? <Login /> : <Navigate to="/home" />}
        />

        <Route path="/" element={admin ? <Layout /> : <Navigate to="/login" />}>
          <Route path="home" element={<Home />} />
          <Route path="employee" element={<Employee />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

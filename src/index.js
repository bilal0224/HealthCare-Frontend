import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SignIn from './signin';
import DoctorPortal from './doctorPortal';
import PatientPortal from './patientPortal';
import DoctorPortalSymptoms from './DoctorPortalSymptoms';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import MyHeader from './myHeader';
import MyFooter from './myFooter';
import { Layout } from 'antd';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App/>
    </Router>
  </React.StrictMode>
);

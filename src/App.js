import React, { useEffect, useState } from 'react';
import Home from './Home';
import { Navigate,Route,Routes,Router } from 'react-router-dom';
import SignIn from './signin';
import DoctorPortal from './doctorPortal';
import PatientPortal from './patientPortal';
import DoctorPortalSymptoms from './DoctorPortalSymptoms'
import MyHeader from './myHeader';
import MyFooter from './myFooter';
import { Layout } from 'antd';
import PageNotFound from './PageNotFound';
import ProtectedRoute from './ProtectedRoute';


const App = () => {
    return (
          <Layout> 
            <Routes>
              <Route index element={
                <ProtectedRoute>
                <Home/>
              </ProtectedRoute>
              } />
              <Route path='/doctor_portal/questions' element={
                <ProtectedRoute>
                    <DoctorPortal/>
                </ProtectedRoute>
              }/>
              <Route path='/patient_portal' element={
                <ProtectedRoute>
                  <PatientPortal/>
                </ProtectedRoute>
              } />
              <Route path='/doctor_portal/symptoms' element={
                <ProtectedRoute>
                  <DoctorPortalSymptoms/>
                </ProtectedRoute>
              }/>
              <Route path='/login' element={<SignIn/>}></Route>
            </Routes>
          </Layout>
  )
};

export default App;

import React from 'react';

import { BrowserRouter as Router ,Route,Routes,Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Dashboard/Home';
import Expense from './pages/Dashboard/Expense';
import Income from './pages/Dashboard/Income';
import UserProvider from './context/UserContext';
import {Toaster} from 'react-hot-toast';
import OtpVerification from './pages/OtpVerification';
//import OtpVerification from './pages/OtpVerification';



const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
         <Route path="/" element={<Root/>}/>
         <Route path="/login" exact element = {<Login/>}/>
          <Route path="/signUp" exact element = {<SignUp/>}/>
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/dashboard" element={<Home/>} />
          <Route path="/income" element={<Income/>} />
          <Route path="/expense" element={<Expense/>} />
        </Routes>
      </Router>
    </div>
    <Toaster
      toastOptions={{
        className:"",
        style:{
          fontSize:'13px'
        },
      }}
      />
     
    </UserProvider>
  );
}
export default App;


const Root = () => {
  //check if token exist in local storage
  const isAuthenticted = !! localStorage.getItem('token');
  //redirect to the dashboard if authenticated,otherwise login
  return isAuthenticted ? (<Navigate to="/dashboard" />) : (<Navigate to="/login" />)
};

//<Route path="/verify-otp/:userId" element={<OtpVerification />} />
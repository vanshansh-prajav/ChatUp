import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './UserAuthentication/LoginPage'
import SignupPage from './UserAuthentication/SignUpPage'
import Home from './Home'

const App = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-slate-700">
    <Router>
      <Routes>
        <Route path="/" element = {<LoginPage />}/>
        <Route path="/signup" element = {<SignupPage />}/>
        <Route path="/home" element = {<Home />}/>
      </Routes>
    </Router>
    </div>
  )
}

export default App
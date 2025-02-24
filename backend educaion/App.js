import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InstitutionList from "./components/InstitutionList";
import UniversityDetails from "./components/UniversityDetails";
import ApplyForm from "./components/ApplyForm";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<InstitutionList />} />
                <Route path="/institution/:id" element={<UniversityDetails />} />
                <Route path="/apply/:id" element={<ApplyForm />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default App;

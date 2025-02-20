import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InstitutionList from "./components/InstitutionList"; // ✅ Import InstitutionList
import UniversityDetails from "./components/UniversityDetails";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<InstitutionList />} /> {/* Add InstitutionList route */}
                <Route path="/institution/:id" element={<UniversityDetails />} />
            </Routes>
        </Router>
    );
};

export default App;

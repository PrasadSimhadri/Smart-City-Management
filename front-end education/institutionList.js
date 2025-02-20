import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/styles.css";
import dashboardBg from "../assets/dashboard-bg.jpg";  // ✅ Import the background image

const InstitutionList = () => {
    const [institutions, setInstitutions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortedInstitutions, setSortedInstitutions] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5001/institutions")
            .then((response) => response.json())
            .then((data) => {
                const institutionsWithRating = data.map(inst => ({
                    ...inst,
                    rating: inst.rating || 4, // Default rating if not present
                }));
                setInstitutions(institutionsWithRating);
                setSortedInstitutions(institutionsWithRating);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const filtered = institutions.filter((inst) =>
            inst.institution.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSortedInstitutions(filtered);
    }, [searchQuery, institutions]);

    return (
        <div className="institution-page">
            {/* ✅ Dashboard Section with Background Image Fix */}
            <div 
                className="dashboard"
                style={{
                    backgroundImage: `url(${dashboardBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100vw",
                    height: "700px"
                    
                }}
            >
                <h1 style={{ fontSize: "5rem", color: "black" }}>INSTITUTION DASHBOARD</h1>

                <h2 style ={{fontSize: "2rem", color: "black" }} >Find The Best Institutions Based On Your Interest.</h2>
            </div>

            {/* Main Content */}
            <div className="container">
                <h1 className="text-center fw-bold">Education Web App</h1>
                <h2 className="text-center mb-4">Institution List</h2>

                <div className="search-sort-container">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search Institutions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button className="btn-primary">Search</button>
                    </div>

                    <div className="sort-buttons">
                        <button className="sort-btn" onClick={() => setSortedInstitutions([...sortedInstitutions].sort((a, b) => a.institution.localeCompare(b.institution)))}>Sort A-Z</button>
                        <button className="sort-btn" onClick={() => setSortedInstitutions([...sortedInstitutions].sort((a, b) => b.institution.localeCompare(a.institution)))}>Sort Z-A</button>
                        <button className="sort-btn" onClick={() => setSortedInstitutions([...sortedInstitutions].sort((a, b) => a.world_rank - b.world_rank))}>Sort by Rank ↑</button>
                        <button className="sort-btn" onClick={() => setSortedInstitutions([...sortedInstitutions].sort((a, b) => b.world_rank - a.world_rank))}>Sort by Rank ↓</button>
                    </div>
                </div>

                {/* Institution List */}
                <div className="institution-list">
                    {sortedInstitutions.map((inst) => (
                        <div key={inst._id} className="institution-item">
                            <Link to={`/institution/${inst._id}`} className="text-decoration-none">
                                <h3>{inst.institution}</h3>
                                <p>Ranking: <strong>{inst.world_rank}</strong></p>
                                <p>Rating: <strong>{inst.rating} ⭐</strong></p>
                            </Link>
                        </div>
                    ))}
                </div>

                {sortedInstitutions.length === 0 && (
                    <div className="alert alert-warning text-center mt-3">
                        No institutions found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstitutionList;

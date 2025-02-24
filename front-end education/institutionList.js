import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/styles.css";
import dashboardBg from "../assets/dashboard-bg.jpg";
import "./InstitutionList.css";

const InstitutionList = () => {
    const [institutions, setInstitutions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortedInstitutions, setSortedInstitutions] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState("A-Z");

    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/institutions`);
                if (!response.ok) {
                    throw new Error("Failed to fetch institutions");
                }
                const data = await response.json();
                setInstitutions(data || []);
                setSortedInstitutions(data || []);
            } catch (err) {
                console.error("Error fetching data:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInstitutions();
    }, []);

    useEffect(() => {
        let filtered = institutions.filter((inst) =>
            inst?.institution?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        switch (sortOption) {
            case "A-Z":
                filtered.sort((a, b) => a.institution.localeCompare(b.institution));
                break;
            case "Z-A":
                filtered.sort((a, b) => b.institution.localeCompare(a.institution));
                break;
            case "Ranking Asc":
                filtered.sort((a, b) => (a.world_rank || 9999) - (b.world_rank || 9999));
                break;
            case "Ranking Desc":
                filtered.sort((a, b) => (b.world_rank || 9999) - (a.world_rank || 9999));
                break;
            default:
                break;
        }

        setSortedInstitutions(filtered);
    }, [searchQuery, sortOption, institutions]);

    const toggleFavorite = (id) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(id)
                ? prevFavorites.filter((favId) => favId !== id)
                : [...prevFavorites, id]
        );
    };

    if (loading) {
        return <div className="text-center mt-5">Loading institutions...</div>;
    }

    if (error) {
        return <div className="text-center text-danger mt-5">Error: {error}</div>;
    }

    return (
        <div className="institution-page">
            <div
                className="dashboard"
                style={{
                    backgroundImage: `url(${dashboardBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100vw",
                    height: "700px",
                    position: "relative"
                }}
            >
                <nav className="auth-nav">
                    <Link to="/signup" className="auth-btn">Sign Up</Link>
                    <Link to="/login" className="auth-btn login-btn">Login</Link>
                </nav>
                <h1 className="dashboard-title">INSTITUTION DASHBOARD</h1>
                <h2 className="dashboard-subtitle">Find The Best Institutions Based On Your Interest</h2>
            </div>

            <div className="container">
                <h1 className="text-center fw-bold">Education Web App</h1>
                <h2 className="text-center mb-4">Institution List</h2>

                <div className="search-sort-container">
                    <input
                        type="text"
                        placeholder="Search Institutions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-box"
                    />
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="sort-dropdown"
                    >
                        <option value="A-Z">Sort by A-Z</option>
                        <option value="Z-A">Sort by Z-A</option>
                        <option value="Ranking Asc">Sort by Ranking (Asc)</option>
                        <option value="Ranking Desc">Sort by Ranking (Desc)</option>
                    </select>
                    <button className="search-btn" onClick={() => console.log("Search clicked!")}>
                        Search
                    </button>
                </div>

                <div className="institution-list">
                    {sortedInstitutions.length > 0 ? (
                        sortedInstitutions.map((inst) => (
                            <div key={inst?._id || Math.random()} className="institution-card">
                                <button
                                    className="favorite-btn"
                                    onClick={() => toggleFavorite(inst._id)}
                                >
                                    {favorites.includes(inst._id) ? "❤️" : "🤍"}
                                </button>
                                <Link to={`/institution/${inst._id}`} className="institution-link">
                                    <div className="card-header">
                                        {inst?.institution || "Unnamed Institution"}
                                    </div>
                                    <div className="card-body">
                                        <p>World Rank: <strong>{inst?.world_rank || "4"}</strong></p>
                                        <p className="rating">Rating: {inst?.rating || "4"} ⭐</p>
                                    </div>
                                </Link>
                                <Link to={`/apply/${inst._id}`}>
                                    <button className="apply-btn">Apply Now</button>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="alert alert-warning text-center mt-3">
                            No institutions found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstitutionList;

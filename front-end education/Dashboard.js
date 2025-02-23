import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ✅ Fetch user profile from backend
    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to view your profile.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:5001/api/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await res.json();
            setUser(data); // ✅ Set user profile data
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile(); // Call fetchProfile when component loads
    }, []);

    if (loading) return <p>Loading your profile...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Welcome, {user?.username}!</h2>
            <p>Email: {user?.email}</p>

            <h3>Liked Universities</h3>
            <ul>
                {user?.likedUniversities?.length > 0 ? (
                    user.likedUniversities.map((uni) => (
                        <li key={uni._id}>
                            {uni.institution} — World Rank: {uni.world_rank}, Rating: {uni.rating}
                        </li>
                    ))
                ) : (
                    <p>No liked universities yet.</p>
                )}
            </ul>

            <h3>Applied Universities</h3>
            <ul>
                {user?.appliedUniversities?.length > 0 ? (
                    user.appliedUniversities.map((uni) => (
                        <li key={uni._id}>
                            {uni.institution} — World Rank: {uni.world_rank}, Rating: {uni.rating}
                        </li>
                    ))
                ) : (
                    <p>No applications submitted yet.</p>
                )}
            </ul>
        </div>
    );
};

export default Dashboard;

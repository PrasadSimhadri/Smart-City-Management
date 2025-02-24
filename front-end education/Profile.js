import React, { useEffect, useState } from 'react';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:5001/auth/profile', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setUser(data))
                .catch((err) => console.error(err));
        }
    }, []);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>My Profile</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <h3>Liked Universities</h3>
            <ul>
                {user.likedUniversities.map((uni) => (
                    <li key={uni._id}>{uni.name}</li>
                ))}
            </ul>
            <h3>Applied Universities</h3>
            <ul>
                {user.appliedUniversities.map((uni) => (
                    <li key={uni._id}>{uni.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Profile;

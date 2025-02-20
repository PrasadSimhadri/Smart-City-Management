import React, { useState, useEffect } from "react";

const Institutions = () => {
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/institutions") // Ensure backend is running
      .then((response) => response.json())
      .then((data) => setInstitutions(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>Education Web App</h1>
      <h2>Institution List</h2>

      {institutions.length === 0 ? (
        <p>No data available</p>
      ) : (
        <ul>
          {institutions.map((inst) => (
            <li key={inst._id}>
              <strong>{inst.name}</strong> - (Ranking: {inst.ranking})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Institutions;

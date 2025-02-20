import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./UniversityDetails.css"; // ✅ Import CSS

const sampleData = {
    "67b1a7517db849031470dd18": {
        name: "Harvard University",
        location: "Cambridge, MA, USA",
        ranking: 1,
        description: "Harvard University is one of the world's most prestigious institutions, known for academic excellence, research, and leadership.",
        facilities: ["State-of-the-art libraries", "Research labs", "World-class faculty", "Diverse extracurricular activities"],
        reviews: [
            { user: "Alice Johnson", rating: 5, comment: "Amazing faculty and diverse programs.", category: "Course" },
            { user: "John Doe", rating: 4, comment: "The campus life is unmatched!", category: "Campus Life" }
        ]
    },
    "67b1a7517db849031470dd19": {
        name: "Stanford University",
        location: "Stanford, CA, USA",
        ranking: 2,
        description: "Stanford University excels in entrepreneurship, innovation, and technology-driven education.",
        facilities: ["Modern research labs", "Entrepreneurial hub", "High-tech libraries", "Sports facilities"],
        reviews: [
            { user: "Emily Brown", rating: 5, comment: "Great professors and innovative courses.", category: "Course" },
            { user: "Michael Smith", rating: 4, comment: "The startup culture here is inspiring.", category: "Opportunities" }
        ]
    },
    "67b1a7517db849031470dd20": {
        name: "Massachusetts Institute of Technology (MIT)",
        location: "Cambridge, MA, USA",
        ranking: 3,
        description: "MIT is globally recognized for its contributions to science, engineering, and technology.",
        facilities: ["World-class research centers", "Innovation labs", "Cutting-edge technology", "Collaborative workspaces"],
        reviews: [
            { user: "Sarah Lee", rating: 5, comment: "Best place for tech and research.", category: "Course" },
            { user: "Daniel Kim", rating: 4, comment: "Great faculty but intense workload.", category: "Academics" }
        ]
    },
    "67b1a7517db849031470dd21": {
        name: "University of California, Berkeley",
        location: "Berkeley, CA, USA",
        ranking: 4,
        description: "UC Berkeley is renowned for its public research excellence and social activism.",
        facilities: ["Public research centers", "Diverse student body", "Advanced computing labs", "Cultural events"],
        reviews: [
            { user: "Jessica Wang", rating: 5, comment: "Strong research environment.", category: "Research" },
            { user: "Robert Evans", rating: 4, comment: "The campus is beautiful and diverse.", category: "Campus Life" }
        ]
    },
    "67b1a7517db849031470dd22": {
        name: "University of Oxford",
        location: "Oxford, England",
        ranking: 5,
        description: "Oxford is the oldest university in the English-speaking world, offering world-class education and research.",
        facilities: ["Historic libraries", "Renowned faculty", "Interdisciplinary research", "Beautiful campuses"],
        reviews: [
            { user: "Hannah Green", rating: 5, comment: "A dream university for many.", category: "Reputation" },
            { user: "James White", rating: 4, comment: "Challenging but worth it!", category: "Academics" }
        ]
    }
};

const UniversityDetails = () => {
    const { id } = useParams();
    const [institution, setInstitution] = useState(sampleData[id] || null);
    const [reviews, setReviews] = useState(sampleData[id]?.reviews || []);
    const [newReview, setNewReview] = useState({ user: "", rating: 5, comment: "", category: "Course" });

    if (!institution) return <div className="alert alert-danger">Institution data not found.</div>;

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);
        setNewReview({ user: "", rating: 5, comment: "", category: "Course" });
    };

    return (
        <div className="container">
            <h1>{institution.name}</h1>
            <p><strong>Location:</strong> {institution.location}</p>
            <p><strong>Ranking:</strong> {institution.ranking}</p>
            <p><strong>Description:</strong> {institution.description}</p>

            <h4>Facilities</h4>
            <ul>
                {institution.facilities.map((facility, index) => <li key={index}>{facility}</li>)}
            </ul>

            <h3>Reviews</h3>
            {reviews.length > 0 ? (
                reviews.map((review, index) => (
                    <div key={index} className="review-card">
                        <strong>{review.user}</strong> ({review.category}) - {review.rating}/5
                        <p>{review.comment}</p>
                    </div>
                ))
            ) : (
                <p>No reviews yet. Be the first to review!</p>
            )}

            <form onSubmit={handleReviewSubmit}>
                <input type="text" placeholder="Your name" value={newReview.user} onChange={(e) => setNewReview({...newReview, user: e.target.value})} required />
                <textarea placeholder="Your review" value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} required />
                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
};

export default UniversityDetails;

import React, { useState } from "react";
import { useParams } from "react-router-dom";

const ApplyForm = () => {
    const { id } = useParams(); // University ID from URL

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        dob: "",
        address: "",
        preferredCourse: "",
        highSchool: "",
        gpa: "",
        extracurriculars: "",
        statement: "",
        file: null,
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === "file" ? files[0] : value 
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("universityId", id);
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        fetch("http://localhost:5001/applications", {
            method: "POST",
            body: formDataToSend,
        })
        .then((response) => response.json())
        .then((data) => {
            alert("✅ Application Submitted Successfully!");
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                dob: "",
                address: "",
                preferredCourse: "",
                highSchool: "",
                gpa: "",
                extracurriculars: "",
                statement: "",
                file: null,
            });
        })
        .catch((error) => console.error("❌ Error submitting application:", error));
    };

    return (
        <div className="apply-container">
            <h2>Apply to University</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} required />
                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                
                <select name="preferredCourse" value={formData.preferredCourse} onChange={handleChange} required>
                    <option value="">Select Preferred Course</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Business">Business</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Medicine">Medicine</option>
                </select>

                <input type="text" name="highSchool" placeholder="High School/College Name" value={formData.highSchool} onChange={handleChange} required />
                <input type="text" name="gpa" placeholder="GPA/Grades" value={formData.gpa} onChange={handleChange} required />
                <textarea name="extracurriculars" placeholder="List Extracurricular Activities" value={formData.extracurriculars} onChange={handleChange} />

                <textarea name="statement" placeholder="Why do you want to apply?" value={formData.statement} onChange={handleChange} required />

                <label>Upload Supporting Documents:</label>
                <input type="file" name="file" onChange={handleChange} />

                <button type="submit">Submit Application</button>
            </form>
        </div>
    );
};

export default ApplyForm;

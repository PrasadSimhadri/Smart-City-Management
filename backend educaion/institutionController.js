const Institution = require("../models/institutionModel");

// Get all institutions
exports.getAllInstitutions = async (req, res) => {
    try {
        const institutions = await Institution.find({});
        res.status(200).json(institutions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching institutions" });
    }
};

// Get institution by ID
exports.getInstitutionById = async (req, res) => {
    try {
        const institution = await Institution.findById(req.params.id);
        if (!institution) {
            return res.status(404).json({ message: "Institution not found" });
        }
        res.status(200).json(institution);
    } catch (error) {
        res.status(500).json({ message: "Error fetching institution details" });
    }
};

// Create a new institution
exports.createInstitution = async (req, res) => {
    try {
        const institution = new Institution(req.body);
        await institution.save();
        res.status(201).json(institution);
    } catch (error) {
        res.status(400).json({ message: "Error creating institution" });
    }
};

// Update an institution
exports.updateInstitution = async (req, res) => {
    try {
        const institution = await Institution.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(institution);
    } catch (error) {
        res.status(400).json({ message: "Error updating institution" });
    }
};

// Delete an institution
exports.deleteInstitution = async (req, res) => {
    try {
        await Institution.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Institution deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting institution" });
    }
};

// Add a review to an institution
exports.addReview = async (req, res) => {
    try {
        const { user, rating, comment, category } = req.body;
        const institution = await Institution.findById(req.params.id);

        if (!institution) return res.status(404).json({ message: "Institution not found" });

        institution.reviews.push({ user, rating, comment, category });
        await institution.save();

        res.status(201).json({ message: "Review added successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error adding review" });
    }
};

// Get all reviews for an institution
exports.getReviews = async (req, res) => {
    try {
        const institution = await Institution.findById(req.params.id);
        if (!institution) return res.status(404).json({ message: "Institution not found" });

        res.status(200).json(institution.reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews" });
    }
};

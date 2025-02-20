const express = require("express");
const {
    getAllInstitutions,
    getInstitutionById,
    createInstitution,
    updateInstitution,
    deleteInstitution,
    searchInstitutions,
    paginateInstitutions,
    addReview,
    getReviews
} = require("../controllers/institutionController");

const router = express.Router();

// Routes for fetching and searching institutions
router.get("/", getAllInstitutions);
router.get("/search", searchInstitutions);
router.get("/paginate", paginateInstitutions);
router.get("/:id", getInstitutionById);

// CRUD operations for institutions
router.post("/", createInstitution);
router.put("/:id", updateInstitution);
router.delete("/:id", deleteInstitution);

// Review routes
router.post("/:id/reviews", addReview);
router.get("/:id/reviews", getReviews);

module.exports = router;

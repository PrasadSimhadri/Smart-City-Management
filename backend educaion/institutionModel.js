const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: String, required: true }, // Reviewer name or ID
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating 1-5
    comment: { type: String, required: true }, // Review text
    category: { type: String, enum: ["Course", "Faculty", "Campus Life"], required: true }, // Type of review
    date: { type: Date, default: Date.now } // Timestamp
});

const institutionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    ranking: { type: Number, required: true },
    courses: { type: [String], required: true },
    reviews: [{ 
        user: String, 
        rating: Number, 
        comment: String 
    }]
});


const Institution = mongoose.model('Institution', institutionSchema);

module.exports = Institution;

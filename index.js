require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "f5$g3^n!7L#r2@8uZ9pQ1X&wE",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
});

mongoose.connection.on("error", err => console.error("Connection error:", err));
mongoose.connection.once("open", () => console.log("Connected to MongoDB"));

// ----------------- Models -----------------

// Login Details Model
const loginSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
const Login = mongoose.model("Login", loginSchema, "login_details");

// Emergency Contacts Model
const contactSchema = new mongoose.Schema({
  service: String,
  contact_number: String,
  area: String
});
const Contact = mongoose.model("Contact", contactSchema, "emergency_contacts");

// Accident Model
const accidentSchema = new mongoose.Schema({
  streetNumber: Number,
  area: String,
  problem: String
});
const Accident = mongoose.model("Accident", accidentSchema, "accidents");

// Tickets Model
const ticketSchema = new mongoose.Schema({
  ticketid: String,
  vehicleType: String,
  rating: { type: Number, default: null },
  description: { type: String, default: "" }
});
const Ticket = mongoose.model("Ticket", ticketSchema, "tickets");

// Booking Model
const bookingSchema = new mongoose.Schema({
  route_id: String,
  source: String,
  destination: String,
  vehicleType: String,
  price: Number,
  seats: Number,
  bookedSeats: Number,
  date: Date
});
const Booking = mongoose.model("Booking", bookingSchema, "bookings");


// Institution Model
const institutionSchema = new mongoose.Schema({
  institution: String,
  world_rank: Number,
  country: String,
  national_rank: Number,
  quality_of_education: Number,
  alumni_employment: Number,
  quality_of_faculty: Number,
  publications: Number,
  influence: Number,
  citations: Number,
  patents: Number,
  score: Number,
  year: Number,
  specialization: String
});
const Institution = mongoose.model("Institution", institutionSchema, "institutions");

app.get("/api/institutions", async (req, res) => {
  try {
    const institutions = await Institution.find().lean();
    res.json(institutions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching institutions data" });
  }
});

const institutionReviewSchema = new mongoose.Schema({
  institute: String, // Must match the 'institute' field in the review documents
  reviewerName: String,
  category: String,
  reviewText: String,
  rating: Number,
  reviewDate: Date
});

const InstitutionReview = mongoose.model("InstitutionReview", institutionReviewSchema, "institution_reviews");

app.get("/api/allInstitutionReviews", async (req, res) => {
  try {
    const allInstitutions = await Institution.find().lean();
    const allReviews = await InstitutionReview.find().lean();

    // Group reviews by institute name (the field name in reviews is "institute")
    const reviewsByInstitute = {};
    allReviews.forEach(review => {
      const key = review.institute;
      if (!reviewsByInstitute[key]) {
        reviewsByInstitute[key] = [];
      }
      reviewsByInstitute[key].push(review);
    });

    // Attach reviews to each institution object (matching by institution name)
    const combinedData = allInstitutions.map(inst => ({
      ...inst,
      reviews: reviewsByInstitute[inst.institution] || []
    }));

    res.json(combinedData);
  } catch (err) {
    console.error("Error in /api/allInstitutionReviews:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Routes -----------------

app.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).send("Error logging out");
      }
      res.redirect("/login.html?message=logged_out");
    });
  } else {
    res.redirect("/login.html?message=logged_out");
  }
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "mainhome.html"));
});
app.get("/education", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "maineducation.html"));
});
app.get("/transportation", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "maintransportation.html"));
});
app.get("/public_transport", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "mainpublic.html"));
});
app.get("/private_transport", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "mainprivate.html"));
});
app.get("/road_safety", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "mainroad.html"));
});
app.get("/contacts", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "emergency.html"));
});
app.get("/roadsafety", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "roadsafety.html"));
});
app.get("/accidents", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "accidents.html"));
});
app.get("/booking_privateride", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "booking_privateride.html"));
});
app.get("/feedback_publictransport", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "publicfeedback.html"));
});
app.get("/thank_you", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "thank_you.html"));
});
app.get("/pre_booking", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "search_tickets.html"));
});
app.get("/institutions", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "institutions.html"));
});
app.get("/online_learning", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "mainonline.html"));
});
app.get("/main_institutions", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "maininstitutions.html"));
});
app.get("/public_exams", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "exams.html"));
});
app.get("/alumni_reviews", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "alumni_reviews.html"));
});
app.get("/drunk_driving", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "drunk_driving.html"));
});
app.get("/pedestrian_hours", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pedestrian_hours.html"));
});
app.get("/road_conditions", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "road_conditions.html"));
});
app.get("/public_schedule", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "public_schedule.html"));
});
app.get("/lost_items", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "lost_items.html"));
});
app.get("/multimodal_journey", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "multimodal_journey.html"));
});
app.get("/nearbyparking", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "nearbyparking.html"));
});
app.get("/nearbyevstations", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "nearbyevstations.html"));
});
app.get("/nearbyfuels", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "nearbyfuels.html"));
});
app.get("/bookmarks", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bookmarks.html"));
});
app.get("/comparecosts_univ", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "comparecosts_univ.html"));
});
app.get("/quespapers", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "quespapers.html"));
});
app.get("/carpooling", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "carpooling.html"));
});
app.get("/farecomparision", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "farecomparision.html"));
});
app.get("/scholarships", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "scholarships.html"));
});
app.get("/exams1", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "scholarships.html"));
});
app.get("/all_institutions", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "all_institutions.html"));
});
app.get("/private_ride_prices", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "private_ride_prices.html"));
});
app.get("/extracurcillar_opportunities", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "extracurcillar_opportunities.html"));
});

// ----------------- Authentication Endpoints -----------------

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await Login.findOne({ email: email.trim(), password: password.trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("User authenticated:", user);
    res.json({ message: "Logged in successfully", user });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await Login.findOne({ email: email.trim() });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const newUser = new Login({ username, email, password });
    await newUser.save();

    console.log("User registered:", newUser);
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Error in registration:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------- API Endpoints for Data -----------------

app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching contacts data" });
  }
});

app.get("/api/accidents", async (req, res) => {
  try {
    const accidents = await Accident.find();
    res.json(accidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/accidents/:id", async (req, res) => {
  try {
    const accident = await Accident.findById(req.params.id);
    if (!accident) {
      return res.status(404).json({ error: "Accident not found" });
    }
    res.json(accident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List of recipient emails
const recipientEmails = [
  "saisimhadri2207@gmail.com",
  "Siddhu4356@gmail.com"
];

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saisimhadri2207@gmail.com",  // Replace with your email
    pass: "kght pxda coha ghra"    // Replace with your email password or app password
  }
});

app.post("/api/accidents", async (req, res) => {
  try {
    const { streetNumber, area, problem } = req.body;
    const accident = new Accident({ streetNumber, area, problem });
    await accident.save();

    // Email content
    const mailOptions = {
      from: "saisimhadri2207@gmail.com",
      to: recipientEmails.join(","),
      subject: "New Accident Alert!",
      text: `A new accident has been reported:\n\nStreet Number: ${streetNumber}\nArea: ${area}\nProblem: ${problem}\n\nStay Alert!`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json(accident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/accidents/:id", async (req, res) => {
  try {
    const { streetNumber, area, problem } = req.body;
    const accident = await Accident.findByIdAndUpdate(
      req.params.id,
      { streetNumber, area, problem },
      { new: true }
    );
    if (!accident) {
      return res.status(404).json({ error: "Accident not found" });
    }
    res.json(accident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Driver & Reviews Endpoints -----------------

// Driver Model
const driverSchema = new mongoose.Schema({
  driverName: String,
  rating: Number,
  phoneNumber: String
});
const Driver = mongoose.model("Driver", driverSchema, "drivers_privaterides");

// Schema and Model for driver reviews
const DriverReviewSchema = new mongoose.Schema({
  driverId: String, // Store as string for simplicity, or convert ObjectId to string when saving
  reviewerName: String,
  rating: Number,
  comment: String,
  date: Date
});
const DriverReview = mongoose.model("DriverReview", DriverReviewSchema, "driver_reviews");


app.get("/api/randomDriver", async (req, res) => {
  try {
    const drivers = await Driver.find().lean();
    if (drivers.length === 0) {
      return res.status(404).json({ error: "No drivers available" });
    }
    console.log(drivers);
    const randomIndex = Math.floor(Math.random() * drivers.length);
    res.json(drivers[randomIndex]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/driverReviews", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Driver ID is required" });
    }
    // Fetch reviews and compare driverId as strings
    const allReviews = await DriverReview.find().lean();
    const reviews = allReviews.filter((rev) => rev.driverId.toString() === id.toString());
    res.json(reviews.slice(0, 5));
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------- Ticket & Booking Endpoints -----------------

app.get("/api/validateTicket", async (req, res) => {
  try {
    let { ticketid, vehicleType } = req.query;
    if (!ticketid || !vehicleType) {
      return res.status(400).json({ exists: false, error: "ticketid and vehicleType required" });
    }
    const t = await Ticket.findOne({
      ticketid: ticketid.trim(),
      vehicleType: { $regex: new RegExp("^" + vehicleType + "$", "i") }
    });
    if (t) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error("Error in validateTicket:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/updateFeedback/:ticketid", async (req, res) => {
  try {
    const { rating, description } = req.body;
    const numericRating = parseFloat(rating);
    const ticketid = req.params.ticketid.trim();

    const ticket = await Ticket.findOneAndUpdate(
      { ticketid },
      { rating: numericRating, description },
      { new: true }
    );
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.json(ticket);
  } catch (err) {
    console.error("Error updating ticket feedback:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/searchTickets", async (req, res) => {
  try {
    const { source, destination } = req.query;
    console.log("Searching for bookings with:", { source, destination });

    const bookings = await Booking.find({
      source: { $regex: new RegExp("^" + source.trim() + "$", "i") },
      destination: { $regex: new RegExp("^" + destination.trim() + "$", "i") }
    });

    console.log("Found bookings:", bookings);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Payment Processing -----------------

app.post("/api/processPayment", async (req, res) => {
  try {
    const { ticketId, paymentMethod, email, cardNumber, cardExpiry, cardCVV, upiId } = req.body;

    if (!ticketId || !paymentMethod || !email) {
      return res.status(400).json({ error: "Missing required information (ticketId, paymentMethod, email)" });
    }

    console.log("Received ticketId:", ticketId);
    // Find the booking by matching route_id with the provided ticketId
    const ticket = await Booking.findById(ticketId);
    if (!ticket) {
      console.error("Ticket not found for ticketId:", ticketId);
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (ticket.bookedSeats >= ticket.seats) {
      return res.status(400).json({ error: "No seats available" });
    }

    // Process payment simulation
    if (paymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCVV) {
        return res.status(400).json({ error: "Incomplete card details" });
      }
      console.log("Processing card payment...");
      // Here, you would integrate with a real payment gateway.
    } else if (paymentMethod === "upi") {
      if (!upiId) {
        return res.status(400).json({ error: "UPI ID is required" });
      }
      console.log("Processing UPI payment...");
      // Here, integrate with a UPI payment gateway.
    } else {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    // Update seat count (simulate booking 1 seat)
    ticket.bookedSeats += 1;
    await ticket.save();

    // Configure nodemailer transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "saisimhadri2207@gmail.com",
        pass: process.env.EMAIL_PASS || "kght pxda coha ghra"
      }
    });

    const formattedDate = ticket.date.toISOString().split("T")[0];

    let mailOptions = {
      from: '"Smart City Booking" <saisimhadri2207@gmail.com>',
      to: email,
      subject: "Booking Confirmation - Your Journey Details",
      text: `Dear Customer,

Your booking for ticket ${ticket.route_id} has been confirmed!

Journey Details:
  - Route: ${ticket.source} to ${ticket.destination}
  - Date: ${formattedDate}
  - Vehicle Type: ${ticket.vehicleType}
  - Price: ₹${ticket.price}

Thank you for choosing our service!

Regards,
Smart City Booking Team`,
      html: `<p>Dear Customer,</p>
             <p>Your booking for ticket <strong>${ticket.route_id}</strong> has been confirmed!</p>
             <h3>Journey Details:</h3>
             <ul>
               <li><strong>Route:</strong> ${ticket.source} to ${ticket.destination}</li>
               <li><strong>Date:</strong> ${formattedDate}</li>
               <li><strong>Vehicle Type:</strong> ${ticket.vehicleType}</li>
               <li><strong>Price:</strong> ₹${ticket.price}</li>
             </ul>
             <p>Thank you for choosing <strong>Smart City Booking</strong>. We wish you a safe and pleasant journey!</p>
             <p>Regards,<br>Smart City Booking Team</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Booking confirmed, but failed to send confirmation email" });
      }
      console.log("Email sent: " + info.response);
      res.json({ message: "Payment processed and confirmation email sent", ticketId: ticket.route_id });
    });
  } catch (err) {
    console.error("Error processing payment:", err);
    res.status(500).json({ error: err.message });
  }
});


const drunkDrivingSchema = new mongoose.Schema({
  Year: Number,
  City: String,
  Total_Accident_Deaths: Number,
  Drunk_Driving_Deaths: Number,
  Percentage: Number
});

const DrunkDriving = mongoose.model("drunk_and_drives", drunkDrivingSchema);

app.get("/api/drunk_driving", async (req, res) => {
  try {
    const data = await DrunkDriving.find({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});


// Schema
const PedestrianSchema = new mongoose.Schema({
  Year: Number,
  City: String,
  Location: String,
  Peak_Morning_Hours: String,
  Peak_Evening_Hours: String,
  Category: String
});

const PedestrianHours = mongoose.model("pedestrian_hours", PedestrianSchema);

// API Route
app.get("/api/pedestrian_hours", async (req, res) => {
  try {
    const data = await PedestrianHours.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const RoadConditionSchema = new mongoose.Schema({
  Year: Number,
  City: String,
  Location: String,
  Condition: String,
  Severity: String,
  Reported_By: String,
  Date_Reported: String,
  Status: String
});

const RoadCondition = mongoose.model("road_conditions", RoadConditionSchema);

app.get("/api/road_conditions", async (req, res) => {
  try {
    const data = await RoadCondition.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/road_conditions", async (req, res) => {
  try {
    const newReport = new RoadCondition(req.body);
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: "Error saving report" });
  }
});

// Public Transports Model (Updated: intermediate_stops and timings as arrays)
const transportSchema = new mongoose.Schema({
  transport_type: String,
  route_no: String,
  source: String,
  destination: String,
  intermediate_stops: [String],
  timings: [String]
});
const Transport = mongoose.model("Transport", transportSchema, "public_transports");

// Public Transports
app.get("/api/public_transport", async (req, res) => {
  try {
    const transports = await Transport.find();
    res.json(transports);
  } catch (err) {
    res.status(500).json({ error: "Error fetching transport data" });
  }
});

// Search Public Transports
app.get("/api/search_transport", async (req, res) => {
  try {
    const { source, destination, intermediate } = req.query;
    const query = {
      source: { $regex: new RegExp("^" + source.trim() + "$", "i") },
      destination: { $regex: new RegExp("^" + destination.trim() + "$", "i") }
    };
    if (intermediate) {
      // Check if any element in the intermediate_stops array matches the regex
      query.intermediate_stops = { $in: [new RegExp(intermediate.trim(), "i")] };
    }
    const transports = await Transport.find(query);
    res.json(transports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Lost Items Model
const lostItemSchema = new mongoose.Schema({
  lost_id: { type: String, unique: true },
  email: String,
  user: String,
  contact_info: String,
  transport_type: String,
  route_no: String,
  lost_date: Date,
  item: String,
  description: String,
  status: { type: String, default: "Reported" }
});
const LostItem = mongoose.model("LostItem", lostItemSchema, "lost_items");

// Utility function to generate a random Lost ID (e.g., L1234)
function generateLostId() {
  return "L" + Math.floor(1000 + Math.random() * 9000).toString();
}

// API endpoint to create a lost item report and send confirmation email
app.post("/api/lost_items", async (req, res) => {
  try {
    const { email, user, contact_info, transport_type, route_no, lost_date, item, description } = req.body;
    if (!email || !user || !contact_info || !transport_type || !route_no || !lost_date || !item || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newLostId = generateLostId();
    const newLostItem = new LostItem({
      lost_id: newLostId,
      email,
      user,
      contact_info,
      transport_type,
      route_no,
      lost_date: new Date(lost_date),
      item,
      description,
      status: "Reported"
    });
    await newLostItem.save();


    // Compose confirmation email
    let mailOptions = {
      from: '"Smart City Lost & Found" <saisimhadri2207@gmail.com>',
      to: email,
      subject: "Lost Item Report Confirmation",
      text: `Dear ${user},

Your lost item report (ID: ${newLostId}) has been submitted successfully.

Item: ${item}
Transport Type: ${transport_type} (Route ${route_no})
Date Reported: ${new Date(lost_date).toLocaleDateString()}

We will update you once your item is found.

Regards,
Smart City Lost & Found Team`,
      html: `<p>Dear ${user},</p>
             <p>Your lost item report (ID: <strong>${newLostId}</strong>) has been submitted successfully.</p>
             <p><strong>Item:</strong> ${item}<br>
             <strong>Transport Type:</strong> ${transport_type} (Route ${route_no})<br>
             <strong>Date Reported:</strong> ${new Date(lost_date).toLocaleDateString()}</p>
             <p>We will update you once your item is found.</p>
             <p>Regards,<br>Smart City Management - Lost & Found Team</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        // Even if email fails, report the lost item as successful.
        return res.status(500).json({ error: "Report saved, but failed to send confirmation email" });
      }
      console.log("Email sent: " + info.response);
      res.status(201).json({ message: "Lost item report submitted successfully", lostItem: newLostItem });
    });
  } catch (err) {
    console.error("Error creating lost item report:", err);
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to fetch lost items (with optional filtering by lost_id)
app.get("/api/lost_items", async (req, res) => {
  try {
    const { lost_id } = req.query;
    let query = {};
    if (lost_id) {
      query.lost_id = lost_id;
    }
    const lostItems = await LostItem.find(query);
    res.json(lostItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multimodal Routes Model for combined journey suggestions
const multimodalRouteSchema = new mongoose.Schema({
  route_id: String,
  segments: [
    {
      from: String,
      to: String,
      transport_mode: String,
      cost: Number,
      timings: String
    }
  ],
  total_cost: Number
});
const MultimodalRoute = mongoose.model("MultimodalRoute", multimodalRouteSchema, "multimodal_routes");

// API endpoint to search for multimodal routes
// It returns routes where the first segment's "from" equals origin (case-insensitive)
// and the last segment's "to" equals destination (case-insensitive)
app.get("/api/search_multimodal", async (req, res) => {
  try {
    const { origin, destination } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({ error: "Origin and Destination are required" });
    }
    // Build a query: compare first segment's "from" and last segment's "to"
    // Using aggregation pipeline to match based on array fields:
    const routes = await MultimodalRoute.aggregate([
      {
        $addFields: {
          firstFrom: { $arrayElemAt: ["$segments.from", 0] },
          lastTo: { $arrayElemAt: ["$segments.to", -1] }
        }
      },
      {
        $match: {
          firstFrom: { $regex: new RegExp("^" + origin.trim() + "$", "i") },
          lastTo: { $regex: new RegExp("^" + destination.trim() + "$", "i") }
        }
      }
    ]);
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const ParkingSchema = new mongoose.Schema({
  name: String,
  address: String,
  distance: Number,
  pricePerHour: Number,
  availableSlots: Number
});

const Parking = mongoose.model('Parking', ParkingSchema, "nearbyparkings");

app.get('/api/nearbyparking', async (req, res) => {
  try {
    const parkingSpaces = await Parking.find();
    res.json(parkingSpaces);
  } catch (error) {
    res.status(500).json({ error: "Error fetching parking data" });
  }
});

// Define Schema & Model
const evStationSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  distance: Number,
  pricePerKWh: Number,
  chargingSpeed: String,
  connectorType: String
});

const EVStation = mongoose.model('EVStation', evStationSchema, "nearbyevs");

// API to Fetch EV Charging Stations by City
app.get('/api/evstations', async (req, res) => {
  try {
    const { city } = req.query;
    let query = {};

    if (city) {
      query.city = { $regex: new RegExp(city, 'i') };
    }

    const stations = await EVStation.find(query).limit(20);
    res.json(stations);
  } catch (error) {
    console.error("Error fetching EV stations:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Define Fuel Station Schema
const fuelStationSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  distance: Number,
  pricePerLitre: Number,
  fuelType: String
});

// Create Model
const FuelStation = mongoose.model('FuelStation', fuelStationSchema, "nearbyfuelstations");

// API Route to Get Fuel Stations
app.get('/api/nearbyfuels', async (req, res) => {
  try {
    const stations = await FuelStation.find();
    res.json(stations);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const all_institutionSchema = new mongoose.Schema({
  Name: String,
  Address: String,
  Website: String,
  Contact: String,
  Email: String,
  VC: String,
  VC_Phone: String,
  REG: String,
  REG_Phone: String,
  Stream: String,
  Courses: String  // Array of courses
});

const All_Institution = mongoose.model("All_Institution", institutionSchema, "all_institutions");

// API Route to get institutions
app.get("/api/all_institutions", async (req, res) => {
  try {
    const institutions = await All_Institution.find();
    res.json(institutions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching institutions" });
  }
});

// ----------------- Scholarships Model -----------------
const scholarshipSchema = new mongoose.Schema({
  university: String,
  course: String,
  country: String,
  scholarship_type: String,
  eligibility: String,
  application_link: String,
});

const Scholarship = mongoose.model("Scholarship", scholarshipSchema, "scholarships");

// API endpoint to get scholarships
app.get("/api/scholarships", async (req, res) => {
  try {
    const scholarships = await Scholarship.find().lean();
    res.json(scholarships);
  } catch (error) {
    res.status(500).json({ error: "Error fetching scholarship data" });
  }
});

const QuestionsSchema = new mongoose.Schema({
  univname: String,
  exam_difficulty: String,
  exam_rank: Number,
  year: Number,
  subject: String,
  exam_type: String,
  question_text: String,
  options: String,
  correct_answer: String,
});

const Questions = mongoose.model("Questions", QuestionsSchema, "questionbanks");

// ----------------- API Endpoint -----------------

// Get unique universities with their exam difficulty
app.get("/api/questions", async (req, res) => {
  try {
    const universities = await Questions.aggregate([
      {
        $group: {
          _id: "$univname",
          exam_difficulty: { $first: "$exam_difficulty" },
        },
      },
      {
        $project: {
          _id: 0,
          univname: "$_id",
          exam_difficulty: 1,
        },
      },
    ]);

    res.json(universities);
  } catch (error) {
    res.status(500).json({ error: "Error fetching universities" });
  }
});

// Get questions for a selected university
app.get("/api/questions/:university", async (req, res) => {
  try {
    const university = req.params.university;
    const questions = await Questions.find({ univname: university }).select(
      "year subject exam_type question_text -_id"
    );

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching questions" });
  }
});

const universitySchema = new mongoose.Schema({
  name: String,
  specialisation: String,
  tuition_fee: Number,
  estimated_cost_of_living: Number,
  financial_aid: String,
  scholarships: String
});

const University = mongoose.model("University", universitySchema, "univcosts");

app.get("/api/universities", async (req, res) => {
  try {
    const universities = await University.find();
    res.json(universities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});

app.post("/api/universities", async (req, res) => {
  try {
    const newUniversity = new University(req.body);
    await newUniversity.save();
    res.status(201).json(newUniversity);
  } catch (error) {
    res.status(400).json({ message: "Error adding university", error });
  }
});

// Fare Comparison Schema and Model
const fareComparisonSchema = new mongoose.Schema({
  start_point: String,
  end_point: String,
  ola_fare: Number,
  uber_fare: Number,
  rapido_fare: Number
});

const FareComparison = mongoose.model("FareComparison", fareComparisonSchema, "fare_comparisons");

// API Endpoint to retrieve fare comparison data
app.get('/api/fare_comparison', async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) {
    return res.status(400).json({ error: "Both start and end locations are required." });
  }

  try {
    const fares = await FareModel.find({ start_point: start, end_point: end }); // Ensure proper filtering
    res.json(fares);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define a Ride schema
const rideSchema = new mongoose.Schema({
  id: Number,
  name: String,
  type: String,
  logo: String,
  price: Number,
  eta: String,
  distance: String,
  carType: String,
  capacity: Number,
  features: [String],
  multiplier: Number,
  pickup: String,
  drop: String
});

// Create a Ride model
const Ride = mongoose.model('Ride', rideSchema, "urbanmobilites");

// GET /api/rides endpoint to retrieve ride data
app.get('/api/rides', async (req, res) => {
  try {
    const rides = await Ride.find({});
    res.json(rides);
  } catch (err) {
    console.error('Error retrieving rides:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000/home");
});
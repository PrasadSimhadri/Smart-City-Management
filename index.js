const express = require("express");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "f5$g3^n!7L#r2@8uZ9pQ1X&wE",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Use secure:true with HTTPS
  })
);

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/smart_city", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
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

app.post("/api/accidents", async (req, res) => {
  try {
    const { streetNumber, area, problem } = req.body;
    const accident = new Accident({ streetNumber, area, problem });
    await accident.save();
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

app.delete("/api/accidents/:id", async (req, res) => {
  try {
    const accident = await Accident.findByIdAndDelete(req.params.id);
    if (!accident) {
      return res.status(404).json({ error: "Accident not found" });
    }
    res.json({ message: "Accident deleted" });
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


app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

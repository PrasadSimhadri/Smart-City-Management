const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/smart_city", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Login Details model for user credentials
const loginSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
const Login = mongoose.model("Login", loginSchema, "login_details");

// API endpoint for login authentication
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

// API endpoint to register new user
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

const session = require("express-session");
app.use(session({
  secret: "f5$g3^n!7L#r2@8uZ9pQ1X&wE",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Use secure:true with HTTPS
}));

app.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).send("Error logging out");
      }
      // Use location.replace in the client so that back button doesn't work
      res.redirect("/login.html?message=logged_out");
    });
  } else {
    res.redirect("/login.html?message=logged_out");
  }
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

app.get("/institutions", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "#"));
});

app.get("/online_learning", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "#"));
});

// Define Schema and Model for emergency contacts
const contactSchema = new mongoose.Schema({
  service: String,
  contact_number: String,
  area: String, // Column name is area
});
const Contact = mongoose.model("emergency_contacts", contactSchema);

// Define the Accident schema and model (use Number for streetNumber)
const accidentSchema = new mongoose.Schema({
  streetNumber: Number,
  area: String,
  problem: String,
});
const Accident = mongoose.model("accidents", accidentSchema);

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// API endpoint for emergency contacts (JSON)
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.get("/add_accident", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "add_accident.html"));
});

// API endpoints for accident reports
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

// Update an accident report by ID
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

// Serve the emergency HTML page at /contacts
app.get("/contacts", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "emergency.html"));
});

// Serve the roadsafety HTML page at /roadsafety
app.get("/roadsafety", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "roadsafety.html"));
});

// Serve the accidents page (frontend) at /accidents (HTML view)
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

// Schema and Model for drivers (with Indian names)
const driverSchema = new mongoose.Schema({
  driverName: String,
  rating: Number,       // e.g., 4.5
  phoneNumber: String,
});
const Driver = mongoose.model("Driver", driverSchema, "drivers_privaterides");
// Third parameter explicitly sets the collection name
// New API endpoint: Get a random driver
app.get("/api/randomDriver", async (req, res) => {
  try {
    // Count total drivers
    const count = await Driver.countDocuments();
    // Generate random skip value
    const random = Math.floor(Math.random() * count);
    const driver = await Driver.findOne().skip(random);
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assume you already have your express, mongoose, cors, and path modules set up
// and your connection to MongoDB is active.

// Schema and Model for public transport tickets (feedback dataset)
const ticketSchema = new mongoose.Schema({
  ticketid: String,
  vehicleType: String,
  rating: { type: Number, default: null },
  description: { type: String, default: "" }
});
const Ticket = mongoose.model("tickets", ticketSchema);

const bookingSchema = new mongoose.Schema({
  route_id: String,
  source: String,
  destination: String,
  vehicleType: String,
  price: Number,
  seats: Number,
  bookedSeats: Number,
  date: String // Stored as "YYYY-MM-DD"
});
const Booking = mongoose.model("Booking", bookingSchema, "bookings");

// Validate ticket details endpoint
app.get("/api/validateTicket", async (req, res) => {
  try {
    let { ticketid, vehicleType } = req.query;
    ticketid = ticketid.trim();
    vehicleType = vehicleType.trim();

    console.log("Validating ticket with:", { ticketid, source, destination, vehicleType });

    const ticket = await Ticket.findOne({
      ticketid,
      vehicleType: { $regex: new RegExp("^" + vehicleType + "$", "i") }
    });

    if (ticket) {
      console.log("Ticket found:", ticket);
      res.json({ exists: true });
    } else {
      console.log("No matching ticket found");
      res.json({ exists: false });
    }
  } catch (err) {
    console.error("Error in validateTicket:", err);
    res.status(500).json({ error: err.message });
  }
});


// Endpoint to update feedback for a ticket
app.put("/api/updateFeedback/:ticketid", async (req, res) => {
  try {
    const { rating, description } = req.body;
    // Convert rating to a number
    const numericRating = parseFloat(rating);
    console.log("Updating feedback for ticket:", req.params.ticketid, "with rating:", numericRating, "and description:", description);

    // Find ticket by ticketid and update feedback fields
    const ticket = await Ticket.findOneAndUpdate(
      { ticketid: req.params.ticketid.trim() },
      { rating: numericRating, description },
      { new: true }
    );
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    console.log("Updated ticket:", ticket);
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Schema and Model for driver reviews
const DriverReviewSchema = new mongoose.Schema({
  driverId: mongoose.Schema.Types.ObjectId,
  reviewerName: String,
  rating: Number,
  comment: String,
  date: Date
});
const DriverReview = mongoose.model("DriverReview", DriverReviewSchema);

app.get("/api/driverReviews", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Driver ID is required" });
    }

    const reviews = await DriverReview.find({ driverId: id }).limit(5);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
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

// API endpoint to process payment, update seat count, and send confirmation email.
app.post("/api/processPayment", async (req, res) => {
  try {
    const { ticketId, paymentMethod, email, cardNumber, cardExpiry, cardCVV, upiId } = req.body;
    if (!ticketId || !paymentMethod || !email) {
      return res.status(400).json({ error: "Missing required information (ticketId, paymentMethod, email)" });
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ error: "Invalid ticket ID" });
    }

    // Find the ticket by ticketId.
    const ticket = await Booking.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Check seat availability
    if (ticket.bookedSeats >= ticket.seats) {
      return res.status(400).json({ error: "No seats available" });
    }

    // Process payment (simulate)
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
    // For Gmail: ensure "Less secure apps" is enabled or use OAuth2
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saisimhadri2207@gmail.com",   // Replace with your email
        pass: "kght pxda coha ghra"         // Replace with your email password or App Password
      }
    });

    // Compose email
    let mailOptions = {
      from: '"Smart City Booking" <saisimhadri2207@gmail.com>', // sender address
      to: email, // recipient's email
      subject: "Booking Confirmation - Your Journey Details",
      text: `Dear Customer,
    
    Your booking for ticket ${ticketId} has been confirmed!
    
    Journey Details:
      - Route: ${ticket.source} to ${ticket.destination}
      - Date: ${ticket.date}
      - Vehicle Type: ${ticket.vehicleType}
      - Price: ₹${ticket.price}
    
    Thank you for choosing Smart City Booking. We wish you a safe and pleasant journey!
    
    Regards,
    Smart City Booking Team`,
      html: `<p>Dear Customer,</p>
             <p>Your booking for ticket <strong>${ticketId}</strong> has been confirmed!</p>
             <h3>Journey Details:</h3>
             <ul>
               <li><strong>Route:</strong> ${ticket.source} to ${ticket.destination}</li>
               <li><strong>Date:</strong> ${ticket.date}</li>
               <li><strong>Vehicle Type:</strong> ${ticket.vehicleType}</li>
               <li><strong>Price:</strong> ₹${ticket.price}</li>
             </ul>
             <p>Thank you for choosing <strong>Smart City Booking</strong>. We wish you a safe and pleasant journey!</p>
             <p>Regards,<br>Smart City Booking Team</p>`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        // Even if email sending fails, we might want to confirm the booking.
        return res.status(500).json({ error: "Booking confirmed, but failed to send confirmation email" });
      }
      console.log("Email sent: " + info.response);
      res.json({ message: "Payment processed and confirmation email sent" });
    });
  } catch (err) {
    console.error("Error processing payment:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
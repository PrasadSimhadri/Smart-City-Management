const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

const dataFilePath = path.join(__dirname, "public", "data.json");
let jsonData = {};
if (fs.existsSync(dataFilePath)) {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    jsonData = JSON.parse(fileContents);
    console.log("Loaded data.json from public folder.");
  } catch (err) {
    console.error("Error reading data.json:", err);
  }
} else {
  console.error("data.json not found in public folder. Using empty data objects.");
  jsonData = {
    accidents: [],
    bookings: [],
    driver_reviews: [],
    drivers_privaterides: [],
    emergency_contacts: [],
    login_details: [],
    tickets: [],
    institutions: []
  };
}


app.use(
  session({
    secret: "f5$g3^n!7L#r2@8uZ9pQ1X&wE",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Use secure:true with HTTPS
  })
);


app.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).send("Error logging out");
      }
      // Use location.replace on the client so back button doesn't work
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


app.post("/api/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user in login_details array
    const user = jsonData.login_details.find(
      (u) => u.email === email.trim() && u.password === password.trim()
    );
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

app.post("/api/register", (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = jsonData.login_details.find(
      (u) => u.email === email.trim()
    );
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const newUser = { username, email, password };
    jsonData.login_details.push(newUser);

    // Optionally persist changes back to data.json
    fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, 2));

    console.log("User registered:", newUser);
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Error in registration:", err);
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/contacts", (req, res) => {
  try {
    res.json(jsonData.emergency_contacts || []);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.get("/api/accidents", (req, res) => {
  try {
    res.json(jsonData.accidents || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single accident by "index" or "id"? 
// If you need an ID system, you'll have to store `_id` in the JSON or handle indexing
app.get("/api/accidents/:id", (req, res) => {
  try {
    const index = parseInt(req.params.id, 10);
    if (isNaN(index) || index < 0 || index >= jsonData.accidents.length) {
      return res.status(404).json({ error: "Accident not found" });
    }
    res.json(jsonData.accidents[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/accidents", (req, res) => {
  try {
    const { streetNumber, area, problem } = req.body;
    const newAccident = { streetNumber, area, problem };
    jsonData.accidents.push(newAccident);

    fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, 2));

    res.status(201).json(newAccident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/institutions", (req, res) => {
  try {
    if (jsonData.institutions && jsonData.institutions.length > 0) {
      return res.json(jsonData.institutions);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/accidents/:id", (req, res) => {
  try {
    const { streetNumber, area, problem } = req.body;
    const index = parseInt(req.params.id, 10);
    if (isNaN(index) || index < 0 || index >= jsonData.accidents.length) {
      return res.status(404).json({ error: "Accident not found" });
    }
    jsonData.accidents[index] = { streetNumber, area, problem };
    fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, 2));
    res.json(jsonData.accidents[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/accidents/:id", (req, res) => {
  try {
    const index = parseInt(req.params.id, 10);
    if (isNaN(index) || index < 0 || index >= jsonData.accidents.length) {
      return res.status(404).json({ error: "Accident not found" });
    }
    jsonData.accidents.splice(index, 1);
    fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, 2));
    res.json({ message: "Accident deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/randomDriver", (req, res) => {
  try {
    const drivers = jsonData.drivers_privaterides || [];
    if (drivers.length === 0) {
      return res.status(404).json({ error: "No drivers available" });
    }
    const randomIndex = Math.floor(Math.random() * drivers.length);
    res.json(drivers[randomIndex]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/driverReviews", (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Driver ID is required" });
    }
    // We assume driverId in JSON is a number or something
    const allReviews = jsonData.driver_reviews || [];
    const reviews = allReviews.filter((rev) => rev.driverId === parseInt(id, 10));
    // Return only up to 5
    res.json(reviews.slice(0, 5));
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// If you store user tickets in data.json
// e.g., array named "tickets" with {ticketid, vehicleType, rating, description}

app.get("/api/validateTicket", (req, res) => {
  try {
    let { ticketid, vehicleType } = req.query;
    if (!ticketid || !vehicleType) {
      return res.status(400).json({ exists: false, error: "ticketid and vehicleType required" });
    }
    const t = jsonData.tickets.find(
      (tk) =>
        tk.ticketid === ticketid.trim() &&
        tk.vehicleType.toLowerCase() === vehicleType.trim().toLowerCase()
    );
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

app.put("/api/updateFeedback/:ticketid", (req, res) => {
  try {
    const { rating, description } = req.body;
    const numericRating = parseFloat(rating);
    const ticketid = req.params.ticketid.trim();

    // Find ticket in data.json
    const idx = jsonData.tickets.findIndex((t) => t.ticketid === ticketid);
    if (idx === -1) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    jsonData.tickets[idx].rating = numericRating;
    jsonData.tickets[idx].description = description;

    fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, 2));

    res.json(jsonData.tickets[idx]);
  } catch (err) {
    console.error("Error updating ticket feedback:", err);
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/searchTickets", (req, res) => {
  try {
    const { source, destination } = req.query;
    console.log("Searching for bookings with:", { source, destination });

    const allBookings = jsonData.bookings || [];
    const filtered = allBookings.filter(
      (b) =>
        b.source.toLowerCase() === source.trim().toLowerCase() &&
        b.destination.toLowerCase() === destination.trim().toLowerCase()
    );

    console.log("Found bookings from JSON:", filtered);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/processPayment", (req, res) => {
  try {
    // In JSON approach, you'd find booking by index or some unique ID
    // then update seats, etc. For brevity, we simulate success
    const { ticketId, paymentMethod, email } = req.body;
    if (!ticketId || !paymentMethod || !email) {
      return res.status(400).json({ error: "Missing required information (ticketId, paymentMethod, email)" });
    }
    // Update seat count in JSON if needed...
    // Then send an email (nodemailer)...

    // Example nodemailer usage
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saisimhadri2207@gmail.com", // Replace with your email
        pass: "kght pxda coha ghra"        // Replace with your password or app password
      },
    });

    let mailOptions = {
      from: '"Smart City Booking" <saisimhadri2207@gmail.com>',
      to: email,
      subject: "Booking Confirmation - JSON Mode",
      text: `Your booking with ID ${ticketId} has been processed via ${paymentMethod}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Booking confirmed, but email failed" });
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
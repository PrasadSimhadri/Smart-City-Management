const { handleLogin } = require("../index"); // Import the handler from index.js
const Login = require("../models/Login"); // Import your Login model
const mongoose = require("mongoose");

describe("Authentication Endpoints", () => {
    beforeAll(async () => {
        // Connect to a test database
        await mongoose.connect("mongodb://localhost:27017/smart_city_test", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        // Disconnect from the database
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear the database before each test
        await Login.deleteMany({});
    });

    it("should login a user with valid credentials", async () => {
        // Create a test user
        await Login.create({
            username: "testuser",
            email: "test@example.com",
            password: "password123",
        });

        // Mock request and response objects
        const req = {
            body: {
                email: "test@example.com",
                password: "password123",
            },
        };
        const res = {
            writeHead: jest.fn(),
            end: jest.fn(),
        };

        // Call the handler
        await handleLogin(req, res);

        // Assertions
        expect(res.writeHead).toHaveBeenCalledWith(200, {
            "Content-Type": "application/json",
        });
        expect(res.end).toHaveBeenCalledWith(
            JSON.stringify({
                message: "Logged in successfully",
                user: expect.objectContaining({
                    email: "test@example.com",
                }),
            })
        );
    });

    it("should reject login with invalid credentials", async () => {
        // Mock request and response objects
        const req = {
            body: {
                email: "wrong@example.com",
                password: "wrongpassword",
            },
        };
        const res = {
            writeHead: jest.fn(),
            end: jest.fn(),
        };

        // Call the handler
        await handleLogin(req, res);

        // Assertions
        expect(res.writeHead).toHaveBeenCalledWith(401, {
            "Content-Type": "application/json",
        });
        expect(res.end).toHaveBeenCalledWith(
            JSON.stringify({ error: "Invalid email or password" })
        );
    });
});
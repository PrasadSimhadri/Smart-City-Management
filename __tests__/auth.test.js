const { handleLogin } = require("../index"); // Import the login handler

describe("Authentication Endpoints", () => {
    let req, res;

    beforeEach(() => {
        // Mock request and response objects
        req = { body: {} };
        res = {
            writeHead: jest.fn(),
            end: jest.fn(),
        };
    });

    it("should login a user with valid credentials", async () => {
        // Mock valid user credentials
        req.body = {
            email: "test@example.com",
            password: "password123",
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
        // Mock invalid user credentials
        req.body = {
            email: "wrong@example.com",
            password: "wrongpassword",
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

const assert = require("assert");

let server;
let serverAuth;

before(async () => {
  server = await import("../src/routes/api/main.js");
  serverAuth = await import("../src/routes/api/auth.js");
});

describe("Server", () => {
  describe("#register()", () => {
    it("should register a new user with valid credentials", async () => {
      const result = await serverAuth.register(
        "newuser@example.com",
        "newusername",
        "newpassword",
        "newpassword",
      );
      console.log("Registration result:", result);
      assert.ok(result, "registration should be successful");

      registeredUserId = result.id; // Store the ID for deletion
    });

    it("should throw an error for invalid or duplicate credentials", async () => {
      await serverAuth.register(
        "newuser@example.com",
        "newusername",
        "password123",
        "password123",
      );
      // Try to duplicate user
      try {
        await serverAuth.register(
          "newuser@example.com",
          "newusername",
          "password123",
          "password123",
        );
        assert.fail("Expected an error to be thrown");
      } catch (error) {
        assert.ok(error instanceof Error, "an error should be thrown");
        assert.strictEqual(
          error.message,
          "Registration failed",
          'error message should be "Registration failed"',
        );
      }
    });

    after(async () => {
      if (registeredUserId) {
        try {
          // Attempt to delete the registered user
          await serverAuth.deleteUserById(registeredUserId);
        } catch (error) {
          assert.fail("Failed to delete the registered user");
        }
      }
    });
  });

  // other test suites...
});

describe("#confirmVerification()", () => {
  it("should confirm email verification with valid user ID and code", async () => {
    // Your test case for successful verification
  });

  it("should throw an error for invalid or expired verification code", async () => {
    // Your test case for verification failure
  });
});

describe("#changePassword()", () => {
  it("should change the password for an authenticated user", async () => {
    // Your test case for successful password change
  });

  it("should throw an error for incorrect old password or invalid token", async () => {
    // Your test case for password change failure
  });
});

const assert = require("assert");

describe("Server", () => {
  let registeredUserEmail; // Store the email of the registered user for deletion

  describe("#register()", () => {
    it("should register a new user with valid credentials", async () => {
      const { register } = await import("../src/routes/api/server.js");

      const result = await register(
        "newuser@example.com",
        "newusername",
        "newpassword",
        "newpassword"
      );
      console.log("Registration result:", result);
      assert.ok(result, "registration should be successful");
      registeredUserEmail = "newuser@example.com"; // Store the email for deletion
    });
    
    it("should throw an error for invalid or duplicate credentials", async () => {
      const { register } = await import("../src/routes/api/server.js");

      await register(
        "newuser@example.com",
        "newusername",
        "password123",
        "password123"
      );
      // Try to duplicate user
      try {
        await register(
          "newuser@example.com",
          "newusername",
          "password123",
          "password123"
        );
        assert.fail("Expected an error to be thrown");
      } catch (error) {
        assert.ok(error instanceof Error, "an error should be thrown");
        assert.strictEqual(
          error.message,
          "Registration failed",
          'error message should be "Registration failed"'
        );
      }
    });

    // Use the `after` hook to clean up the registered user
    after(async () => {
      if (registeredUserEmail) {
        const { deleteUser } = await import("../src/routes/api/server.js");
        try {
          // Attempt to delete the registered user
          await deleteUser(registeredUserEmail);
        } catch (error) {
          assert.fail("Failed to delete the registered user");
        }
      }
    });
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
});

const assert = require("assert");
require("dotenv").config();

let server;
let serverAuth;

before(async () => {
  server = await import("../src/routes/api/main.js");
  serverAuth = await import("../src/routes/api/auth.js");
});

describe("Server", () => {
  let registeredUserId; // declare the variable here

  describe("#register()", () => {
    it("should register a new user with valid credentials", async () => {
      await serverAuth.deleteUserByEmail("newuser@example.com");

      const result = await serverAuth.register(
        "newuser@example.com",
        "newusername",
        "newpassword",
        "newpassword",
      );
      assert.ok(result, "registration should be successful");

      registeredUserId = result.id; // Store the ID for deletion
    });

    it("should throw an error for invalid or duplicate credentials", async () => {
      // The user has been created in the previous test, so no need to delete them here
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
          error.response.message,
          "Failed to create record.",
          'error message should be "Failed to create record."',
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

  // TODO finish writing tests

  // describe("#confirmVerification()", () => {
  //   it("should confirm email verification with valid user ID and code", async () => {
  //     // Your test case for successful verification
  //   });

  //   it("should throw an error for invalid or expired verification code", async () => {
  //     // Your test case for verification failure
  //   });
  // });

  // describe("#changePassword()", () => {
  //   it("should change the password for an authenticated user", async () => {
  //     // Your test case for successful password change
  //   });

  //   it("should throw an error for incorrect old password or invalid token", async () => {
  //     // Your test case for password change failure
  //   });
  // });
});

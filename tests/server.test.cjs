const assert = require("assert");
require("dotenv").config();

let serverAuth;

before(async () => {
  server = await import("../src/routes/api/main.js");
  serverAuth = await import("../src/routes/api/auth.js");
  changePassword = serverAuth.changePassword;
});

describe("Server", () => {
  describe("#register()", () => {
    it("should register a new user with valid credentials", async () => {
      await serverAuth.deleteUserByName("newusername");

      const result = await serverAuth.register(
        "newuser@example.com",
        "newusername",
        "newpassword",
        "newpassword",
      );
      assert.ok(result, "registration should be successful");
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
      try {
        await serverAuth.deleteUserByName("newusername");
      } catch (error) {
        assert.fail("Failed to delete the registered user");
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

  describe("#changePassword()", () => {
    it("should throw an error for incorrect old password or invalid token", async () => {
      await serverAuth.deleteUserByName("forgetfulUser");
      let token;

      try {
        await serverAuth.register(
          "changepassword@example.com",
          "forgetfulUser",
          "changeThisPassword",
          "changeThisPassword",
        );

        const currentUser = await serverAuth.authenticate(
          "changepassword@example.com",
          "changeThisPassword",
          true,
        );

        try {
          const userID = await serverAuth.getUserIdByName("forgetfulUser");
          await changePassword(userID, "changeThisPassword", "newPassword");
        } catch {
          throw new Error("Failed to change the password.");
        }

        // Login with old password
        await serverAuth.authenticate(
          "changepassword@example.com",
          "changeThisPassword",
          true,
        );
        assert.fail("Expected an error to be thrown");
      } catch (error) {
        try {
          // Try to login with new password
          await serverAuth.authenticate(
            "changepassword@example.com",
            "newPassword",
            true,
          );
        } catch (error) {
          assert.fail("Failed to authenticate with new password");
        }
      }

      after(async () => {
        try {
          // Attempt to delete the registered user
          await serverAuth.deleteUserByName("forgetfulUser");
        } catch (error) {
          assert.fail("Failed to delete the registered user");
        }
      });
    });
  });
});

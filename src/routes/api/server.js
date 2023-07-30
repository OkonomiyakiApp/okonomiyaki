import PocketBase from "pocketbase";
import { writable } from "svelte/store";
import { PUBLIC_POCKETBASE_URL } from "$env/static/public";

const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
export const currentUser = writable(pb.authStore.model);

let tokenVerifier; // Make it accessible in this module scope

class TokenVerifier {
  constructor(pocketBaseInstance, pollingInterval) {
    this.pb = pocketBaseInstance;
    this.pollingInterval = pollingInterval;
    this.intervalId = null;
  }

  async isTokenValid() {
    try {
      // Call the auth-refresh method.
      await this.pb.collection("users").authRefresh();
      return true;
    } catch (error) {
      // If the request fails, the token is invalid.
      return false;
    }
  }

  start() {
    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(async () => {
      if (!(await this.isTokenValid())) {
        logOut(); // Use O function to clear user data and stop verification
      }
    }, this.pollingInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Initialize TokenVerifier outside of any function
tokenVerifier = new TokenVerifier(pb, 10000);

// Subscribe to the currentUser store
// This will start or stop the TokenVerifier whenever currentUser changes
currentUser.subscribe((user) => {
  if (user) {
    tokenVerifier.start();
  } else {
    tokenVerifier.stop();
  }
});

// Fetch current user from backend when the application starts
pb.collection("users")
  .authRefresh()
  .then(
    (authData) => {
      // If there's a valid session, update currentUser and start the TokenVerifier
      currentUser.set(authData.record);
    },
    (error) => {
      console.error("Failed to refresh authentication", error);
      // If there's no valid session, clear currentUser and stop the TokenVerifier
      currentUser.set(null);
    }
  );

// Logging in
export async function authenticate(username, password) {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(username, password);

    // Check if the email has been verified
    if (!authData.record.isEmailVerified) {
      throw new Error("Email not verified");
    }

    // Update currentUser store with the user's data
    currentUser.set(authData.record);

    // Redirect to home page
    window.location.href = "/";
  } catch (error) {
    console.error("Authentication failed", error);
    throw error;
  }
}


// Registering
export async function register(email, username, password, passwordConfirm) {
  try {
    // Create a new user
    const userData = await pb.collection("users").create({
      email,
      username,
      password,
      passwordConfirm,
    });

    // If registration is successful, request email verification
    await pb.collection("users").requestVerification(email);

    // Redirect to the email verification page
    window.location.href = "/login";
  } catch (error) {
    console.error("Registration failed", error);
    throw error;
  }
}

// Confirming email verification
export async function confirmVerification(userId, code) {
  try {
    // Confirm email verification
    await pb.collection("users").confirmVerification(userId, code);

    // Redirect to the login page
    window.location.href = "/login";
  } catch (error) {
    console.error("Email verification failed", error);
    throw error;
  }
}

// Logging out
export function logOut() {
  // Clear user data and stop token verifier on O
  currentUser.set(null);
  pb.authStore.clear();

  // Redirect to home page
  window.location.href = "/";
}

// Change password
export async function changePassword(token, oldPassword, newPassword) {
  try {
    // First, get the current user
    const user = pb.authStore.model;

    // Check if the user exists
    if (!user) {
      throw new Error("No user is currently logged in");
    }

    // Check if the old password is correct by re-authenticating the user
    const authData = await pb.admins.authWithPassword(
      user.username,
      oldPassword
    );

    // If re-authentication succeeds, then the old password is correct.
    // Change the password using PocketBase's confirmPasswordReset method
    if (authData.record) {
      await pb.admins.confirmPasswordReset(token, newPassword, newPassword);

      // Re-authenticate the user with the new password
      await pb.admins.authWithPassword(user.username, newPassword);
    }
  } catch (error) {
    console.error("Failed to change password", error);
    throw error;
  }
}

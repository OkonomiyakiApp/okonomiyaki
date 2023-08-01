import { writable } from "svelte/store";
import { TokenVerifier } from "./tokenVerifier";
import { pb } from "./main";

export const currentUser = writable(pb.authStore.model);

let tokenVerifier = new TokenVerifier(pb, 10000);

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
      tokenVerifier.start();
    },
    (error) => {
      console.error("Failed to refresh authentication", error);
      // If there's no valid session, clear currentUser and stop the TokenVerifier
      currentUser.set(null);
      tokenVerifier.stop();
    },
  );

currentUser.subscribe((user) => {
  if (user) {
    tokenVerifier.start();
  } else {
    tokenVerifier.stop();
  }
});

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

    // Try to refresh auth after logging in
    pb.collection("users")
      .authRefresh()
      .then(
        (authData) => {
          // If there's a valid session, update currentUser and start the TokenVerifier
          currentUser.set(authData.record);
          tokenVerifier.start();
        },
        (error) => {
          console.error("Failed to refresh authentication", error);
          // If there's no valid session, clear currentUser and stop the TokenVerifier
          currentUser.set(null);
          tokenVerifier.stop();
        },
      );
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

    console.log("Registration successful:", userData); // Log the user data for verification
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
  } catch (error) {
    console.error("Email verification failed", error);
    throw error;
  }
}

// Logging out
export function logOut() {
  // Clear user data and stop token verifier on logout
  currentUser.set(null);
  pb.authStore.clear();
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
    const authData = await pb
      .collection("users")
      .authWithPassword(user.username, oldPassword);

    // Change the password using PocketBase's confirmPasswordReset method
    if (authData.record) {
      await pb
        .collection("users")
        .confirmPasswordReset(token, newPassword, newPassword);

      // Re-authenticate the user with the new password
      await pb.collection("users").authWithPassword(user.username, newPassword);
    }
  } catch (error) {
    console.error("Failed to change password", error);
    throw error;
  }
}

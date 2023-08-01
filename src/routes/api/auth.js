import { writable } from "svelte/store";
import { pb } from "./main.js";
import { TokenVerifier } from "./tokenVerifier.js";
import { error } from "@sveltejs/kit";

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
      currentUser.set(authData.record);
      tokenVerifier.start();
    },
    () => {
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
    if (!authData.record.verified) {
      throw new Error("Email not verified.");
    }

    currentUser.set(authData.record);

    pb.collection("users")
      .authRefresh()
      .then(
        (authData) => {
          currentUser.set(authData.record);
          tokenVerifier.start();
        },
        () => {
          currentUser.set(null);
          tokenVerifier.stop();
        },
      );
  } catch (error) {
    throw error;
  }
}

// Registering
export async function register(email, username, password, passwordConfirm) {
  try {
    const userData = await pb.collection("users").create({
      email,
      username,
      password,
      passwordConfirm,
    });

    await pb.collection("users").requestVerification(email);

    return userData;
  } catch (error) {
    throw error;
  }
}

// Confirming email verification
export async function confirmVerification(userId, code) {
  try {
    await pb.collection("users").confirmVerification(userId, code);
  } catch (error) {
    throw error;
  }
}

// Logging out
export function logOut() {
  currentUser.set(null);
  pb.authStore.clear();
}

// Change password
export async function changePassword(token, oldPassword, newPassword) {
  try {
    const user = pb.authStore.model;

    if (!user) {
      throw new Error("No user is currently logged in");
    }

    const authData = await pb
      .collection("users")
      .authWithPassword(user.username, oldPassword);

    if (authData.record) {
      await pb
        .collection("users")
        .confirmPasswordReset(token, newPassword, newPassword);

      await pb.collection("users").authWithPassword(user.username, newPassword);
    }
  } catch (error) {
    throw error;
  }
}

// Delete user by ID
export async function deleteUserById(userID) {
  if (!userID) {
    throw new Error('User ID is required');
  }

  try {
    await pb.collection("users").delete(userID);
  } catch (error) {
    throw error;
  }
}

// Deleting user by email
export async function deleteUserByEmail(email) {
  if (!email) {
    throw new Error('Email is required');
  }

  try {
    const users = await pb.collection("users").getFullList();
    
    const user = users.find(user => user.email === email);

    if (!user) {
      return;
    }

    await pb.collection("users").delete(user.id);
  } catch (error) {
    throw error;
  }
}

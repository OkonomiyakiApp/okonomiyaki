import { writable } from "svelte/store";
import { pb } from "./main.js";
import { TokenVerifier } from "./tokenVerifier.js";

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
export async function authenticate(
  username,
  password,
  skipEmailVerification = false,
) {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(username, password);

    if (skipEmailVerification) {
      return;
    }

    // Check if the email has been verified or if email verification should be skipped
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

// Logging out
export function logOut() {
  currentUser.set(null);
  pb.authStore.clear();
}

// Change password
export async function changePassword(userID, oldPassword, newPassword) {
  try {
    const data = {
      "password": newPassword,
      "passwordConfirm": newPassword,
      "oldPassword": oldPassword,
    };

    // The requested resource wasn't found
    await pb.collection("users").update(userID, data);
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

// Delete user with ID
export async function deleteUser(userID) {
  try {
    if (userID) {
      pb.collection("users").delete(userID);
    } else {
      console.log(`User with userID ${userID} not found.`);
    }
  } catch (error) {
    console.error("Failed to delete user", error);
    throw error;
  }
}

// Fetch user ID by the username
export async function getUserIdByName(userName) {
  try {
    const users = await pb
      .collection("users")
      .getList(1, 10, { filter: `username='${userName}'` });

    if (users.totalItems === 0) {
      return null;
    }

    const userId = users.items[0].id;

    return userId;
  } catch (error) {
    console.error(`Error fetching user with name: ${userName}:`, error);
    return null;
  }
}

// Delete user by the user name
export async function deleteUserByName(userName) {
  try {
    const userId = await getUserIdByName(userName);

    if (userId) {
      await pb.collection("users").delete(userId);
    }
  } catch (error) {
    console.error(`Error deleting user with name: ${userName}:`, error);
  }
}

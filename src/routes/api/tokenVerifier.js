import { logOut } from "./auth.js";
import { pb } from "./main.js";

let tokenVerifier; // Make it accessible in this module scope

export class TokenVerifier {
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

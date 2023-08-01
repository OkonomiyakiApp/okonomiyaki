import PocketBase from "pocketbase";

let url;

if (import.meta.env) {
  // client-side in Vite
  url = import.meta.env.VITE_POCKETBASE_URL;
} else {
  // server-side in Node.js
  url = process.env.VITE_POCKETBASE_URL;
}

export const pb = new PocketBase(url);

import PocketBase from "pocketbase";
import dotenv from "dotenv";

dotenv.config();

export const pb = new PocketBase(process.env.VITE_POCKETBASE_URL);

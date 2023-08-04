import { pb } from "./main";

export async function isTokenValid(token) {
  pb.authRefresh();
}

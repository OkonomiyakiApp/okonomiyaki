import { pb } from "./main.js";

export async function fetchMostRecentVideos(page, videoAmount) {
  const result = await pb
    .collection("videos")
    .getList(page, videoAmount, { sort: "-created" });
  const mostRecentVideos = result.items;
  return mostRecentVideos;
}

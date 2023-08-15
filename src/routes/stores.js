import { Color } from "color-picker-svelte";
import { writable } from "svelte/store";

export const isLoading = writable(false);
export const showWPM = writable(true);
export const showWordsRead = writable(true);
export const pickedBackgroundColor = writable(new Color("#0D1B2A"));

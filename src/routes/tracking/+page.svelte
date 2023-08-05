<script>
  import Heatmap from "$lib/components/Heatmap.svelte";
  import TrackingCategories from "$lib/components/TrackingCategories.svelte";
  import { pb } from "../api/main";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  let selectedDay = null;

  // create a svelte store
  let isValid = writable(false);

  onMount(async () => {
    // set the store's value
    isValid.set(await pb.authStore.isValid);
  });

  function handleDaySelected(event) {
    selectedDay = event.detail; // Update the selectedDay variable with the selected day from the Heatmap component
  }
</script>

<svelte:head>
  <title>Tracking</title>
</svelte:head>

{#if $isValid}
  <h1 class="flex justify-center mt-10 text-4xl font-bold text-white">
    Tracking
  </h1>
  <TrackingCategories />

  <div class="flex justify-center mt-20 text-white">
    <h1>{selectedDay}</h1>
  </div>

  <div class="flex justify-center mt-20">
    <Heatmap on:daySelected={handleDaySelected} />
  </div>
{:else}
  <div class="flex flex-col items-center min-h-screen">
    <h1 class="m-10 text-3xl font-bold text-white">Tracking</h1>
  </div>
{/if}

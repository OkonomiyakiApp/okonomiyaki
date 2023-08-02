<script>
  import { toast } from "@zerodevx/svelte-toast";
  import { currentUser } from "../api/auth";
  import Heatmap from "$lib/components/Heatmap.svelte";

  let selectedDay = null;

function handleDaySelected(event) {
  selectedDay = event.detail; // Update the selectedDay variable with the selected day from the Heatmap component
}
</script>

<svelte:head>
  <title>Tracking</title>
</svelte:head>

{#if $currentUser}
  <h1 class="flex justify-center mt-10 text-2xl text-white">Tracking</h1>
  <div class="flex justify-center content-between mt-10 space-x-2">
    <button
      class="flex justify-center items-center px-4 py-2 font-bold text-white rounded bg-silverlake hover:bg-yblue"
    >
      <i class="mr-2 material-icons">headset</i>
      Listening
    </button>
    <button
      class="flex justify-center items-center px-4 py-2 font-bold text-white rounded bg-silverlake hover:bg-yblue"
    >
      <i class="mr-2 material-icons">headset</i>
      Reading
    </button>
    <button
      class="flex justify-center items-center px-4 py-2 font-bold text-white rounded bg-silverlake hover:bg-yblue"
    >
      <i class="mr-2 material-icons">headset</i>
      Flashcards
    </button>
    <button
      class="flex justify-center items-center px-4 py-2 font-bold text-white rounded bg-silverlake hover:bg-yblue"
    >
      <i class="mr-2 material-icons">headset</i>
      Immersion
    </button>
    <button
      class="flex justify-center items-center px-4 py-2 font-bold text-white rounded bg-silverlake hover:bg-yblue"
    >
      <i class="mr-2 material-icons">headset</i>
      Grammer
    </button>
  </div>

  <div class="flex justify-center mt-20 text-white">
    <!-- Pass the selectedDay prop to the Heatmap component -->
    {selectedDay}
  </div>

  <div class="flex justify-center mt-20">
    <Heatmap on:daySelected={handleDaySelected} />
  </div>
{:else}
  {toast.push('Please login <a href="/login" class="underline">here.</a>')}
  <div class="flex flex-col items-center min-h-screen">
    <h1 class="m-10 text-3xl font-bold text-white">Tracking</h1>
  </div>
{/if}

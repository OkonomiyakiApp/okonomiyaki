<script>
  import { fade } from "svelte/transition";
</script>

<svelte:head>
  <title>About</title>
</svelte:head>

<div
  class="flex flex-col items-center min-h-screen"
  in:fade={{ delay: 250, duration: 500 }}
>
  <h1 class="m-10 text-3xl font-bold text-white">About Us</h1>
  <div
    class="flex flex-col p-10 m-4 space-y-4 w-1/2 bg-gray-700 rounded-lg border border-gray-600 shadow-lg"
  >
    <p class="text-xl text-white">
      Welcome to the beta of Okonomiyaki. I hope you enjoy browsing our library
      of immersion content.
    </p>
    <p class="text-xl text-white">
      This website was made because I noticed no platform existed for the sole
      purpose of creating a large database of content for learning Japanese.
      Though some Discord channels existed, there was no way to filter videos
      with hard subs, soft subs, or even search by categories.
    </p>
    <p class="text-xl text-white">
      Please understand that this site is still in beta and is bound to have
      bugs at the moment.
    </p>
    <p class="text-xl text-white">Happy learning. - Sudden</p>
    <img
      src="/azumanga.png"
      alt="Chiyo Chan"
      class="mr-auto ml-auto w-1/2 h-1.2"
    />
  </div>
</div>

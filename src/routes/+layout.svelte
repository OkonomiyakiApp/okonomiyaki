<!-- $layout.svelte -->

<script>
  import { onMount } from "svelte";
  import Navbar from "../lib/components/Navbar.svelte";
  import "./styles.css";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { pb } from "./api/main";
  import { isLoading } from "./stores";
  import Spinner from "$lib/components/Spinner.svelte";
  const options = {
    duration: 4000, // duration of progress bar tween to the `next` value
    initial: 1, // initial progress bar value
    next: 0, // next progress value
    pausable: false, // pause progress bar tween on mouse hover
    dismissable: true, // allow dismiss with close button
    reversed: true, // insert new toast to bottom of stack
    intro: { x: 256 }, // toast intro fly animation settings
    theme: {}, // css var overrides
    classes: [], // user-defined classes
  };
  onMount(async () => {
    isLoading.set(true);
    await pb.collection("users").authRefresh();
    isLoading.set(false);
  });
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="/node_modules/material-icons/iconfont/material-icons.css"
  />
</svelte:head>

{#if $isLoading}
  <Spinner />
{:else}
  <div class="flex overflow-hidden h-screen">
    <Navbar />
    <div class="overflow-auto flex-1">
      <slot />
    </div>
    <SvelteToast {options} />
  </div>
{/if}

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.richblack);
  }
  :global(._toastContainer) {
    top: auto !important;
    right: 2rem !important;
    bottom: 1.5rem !important;
    left: auto !important;
    z-index: 9999 !important;
  }
  :global(._toastItem) {
    --toastBackground: #778da9;
    --toastColor: #0d1b2a;
  }
  :global(._toastBar) {
    --toastBarBackground: #415a77;
  }
  :global(._toastContainer) {
    z-index: 9999 !important;
  }
</style>

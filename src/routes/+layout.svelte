<script>
  import { onMount } from "svelte";
  import Navbar from "../lib/components/Navbar.svelte";
  import "./styles.css";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { pb } from "./api/main";
  import { isLoading } from "./stores.js";
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
    try {
      await pb.collection("users").authRefresh();
    } catch {
      console.warn("User not logged in.");
    }
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
    --toastBackground: theme(colors.silverlake) !important;
    --toastColor: theme(colors.richblack) !important;
  }
  :global(._toastBar) {
    --toastBarBackground: theme(colors.yblue) !important;
  }
  :global(._toastContainer) {
    z-index: 9999 !important;
  }
  :global(.color-picker) {
    background: theme(colors.yblue) !important;
  }
  :global(.input) {
    background: theme(colors.yblue) !important;
    margin: 10 !important;
    padding: 10 !important;
    border: 0px !important;
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0) !important;
    cursor: pointer !important;
  }

  :global(.input:hover) {
    background: var(--hover-yblue) !important;
  }
</style>

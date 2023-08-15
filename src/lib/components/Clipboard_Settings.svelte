<script>
  import {
    showWPM,
    showWordsRead,
    pickedBackgroundColor,
  } from "../../routes/stores";
  import { ColorInput } from "color-picker-svelte";

  let menuOpen = false;
  let menuButton;
  let menu;

  function toggleMenu() {
    menuOpen = !menuOpen;
    if (menuOpen) {
      // Adding the event listener when the menu is open
      setTimeout(
        () => document.addEventListener("click", handleOutsideClick),
        0,
      );
    } else {
      // Removing the event listener when the menu is closed
      document.removeEventListener("click", handleOutsideClick);
    }
  }

  function handleOutsideClick(event) {
    if (!menu.contains(event.target) && event.target !== menuButton) {
      menuOpen = false;
      document.removeEventListener("click", handleOutsideClick);
    }
  }
</script>

<div class="relative select-none" bind:this={menu}>
  <button bind:this={menuButton} on:click={toggleMenu} class="...">
    <i class="material-icons">settings</i>
  </button>
  {#if menuOpen}
    <div class="absolute right-0 top-full mt-2 w-48 rounded shadow-lg bg-yblue">
      <label class="flex items-center p-4 cursor-pointer hover:bg-silverlake">
        <input
          type="checkbox"
          bind:checked={$showWordsRead}
          class="mr-2 cursor-pointer"
        />
        Show Words Read
      </label>
      <label class="flex items-center p-4 cursor-pointer hover:bg-silverlake">
        <input
          type="checkbox"
          bind:checked={$showWPM}
          class="mr-2 cursor-pointer"
        />
        Show WPM
      </label>
      <div class="text-white cursor-pointer hover:bg-silverlake"> <!-- Removed p-4 -->
        <ColorInput
          class="full-size color-input-margin"
          bind:color={$pickedBackgroundColor}
          title="Background"
        />
      </div>
      <div class="p-4 cursor-pointer hover:bg-silverlake">Menu Item 2</div>
      <div class="p-4 cursor-pointer hover:bg-silverlake">Menu Item 3</div>
    </div>
  {/if}
</div>

<style>
</style>

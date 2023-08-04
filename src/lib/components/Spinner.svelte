<script>
    import { onMount, onDestroy } from 'svelte';
  
    let spinning = true;
    let intervalId;
  
    onMount(() => {
      intervalId = setInterval(() => {
        spinning = !spinning;
      }, 2000);
    });
  
    onDestroy(() => {
      clearInterval(intervalId);
    });
  </script>
  
  <div class="flex justify-center items-center w-screen h-screen">
    <img
      src="/icon.png"
      alt="Spinning Logo"
      class="object-cover w-20 h-20 animate-spin"
      class:animate-pause={!spinning}
    />
  </div>
  
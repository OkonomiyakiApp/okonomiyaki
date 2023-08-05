<script>
  import { onMount, onDestroy } from "svelte";
  let textArray = [];
  let observer;

  onMount(() => {
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeName.toLowerCase() === "p" &&
            node.parentElement === document.body
          ) {
            textArray = [...textArray, node.textContent];
            document.body.removeChild(node);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true });
  });

  onDestroy(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  function removeLine(index) {
    textArray = textArray.filter((_, i) => i !== index);
  }
</script>

<div class="justify-center max-h-60 text-white">
  {#each textArray as text, index (index)}
    <div class="relative p-2 m-2 bg-opacity-10 rounded bg-yblue">
      {#each text.split("\n") as line, lineIndex}
        {#if lineIndex === 0}
          <div class="flex items-center">
            <span class="mr-2 select-none">•</span>
            <p class="text-white">{line}</p>
          </div>
        {:else}
          <p class="text-white">{line}</p>
        {/if}
      {/each}
      <span
        class="absolute top-2 right-2 cursor-pointer material-icons"
        on:click={() => removeLine(index)}>remove_circle</span
      >
    </div>
  {/each}
</div>

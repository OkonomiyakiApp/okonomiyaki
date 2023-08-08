<script>
import { onMount, onDestroy } from "svelte";
import TinySegmenter from "tiny-segmenter";

let textArray = [];
let wordCount = 0;
let startTime = new Date();
let segmenter = new TinySegmenter();
let wpm = 0;
let interval;
let observer;

// Count words in a text
function countWords(text) {
  const tokens = segmenter.segment(text);
  return tokens.filter((token) => token !== "。").length;
}

// Calculate Words Per Minute
function computeWPM() {
  const elapsedMinutes = (new Date().getTime() - startTime.getTime()) / (1000 * 60);
  if(elapsedMinutes === 0) return 0; 
  return Math.round(wordCount / elapsedMinutes);
}

function removeLine(index) {
  wordCount -= countWords(textArray[index]);
  textArray = textArray.filter((_, i) => i !== index);
}

onMount(() => {
  // Periodic WPM update
  interval = setInterval(() => {
    wpm = computeWPM();
  }, 1000);

  // Monitor body for new <p> nodes
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName.toLowerCase() === "p" && node.parentElement === document.body) {
          textArray = [...textArray, node.textContent];
          wordCount += countWords(node.textContent);
          document.body.removeChild(node);
        }
      });
    });
  });
  observer.observe(document.body, { childList: true });
});

onDestroy(() => {
  clearInterval(interval);
  observer.disconnect();
});

$: {
  wpm = computeWPM();
}
</script>

<div class="flex p-4 space-x-12 text-white">
  <h1>Words Read: {wordCount}</h1>
  <h1>WPM: {wpm}</h1>
</div>

<div class="justify-center text-white">
  {#each textArray as text, index (index)}
    <div class="relative p-4 m-2 text-3xl bg-opacity-10 rounded bg-yblue">
      {#each text.split("\n") as line, lineIndex}
        {#if lineIndex === 0}
          <div class="flex items-center">
            <span class="mr-2 select-none">•</span>
            <p class="font-sans font-bold text-white">{line}</p>
          </div>
        {:else}
          <p class="font-sans font-bold text-white">{line}</p>
        {/if}
      {/each}
      <span
        class="absolute top-2 right-2 cursor-pointer material-icons text-yblue"
        on:click={() => removeLine(index)}>remove_circle</span
      >
    </div>
  {/each}
</div>

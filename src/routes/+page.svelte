<script>
  import { onMount } from "svelte";
  import { fetchMostRecentVideos } from "./api/videos";

  const itemsPerPage = 12;

  let videos = [];

  let paginatedVideos = [];
  let currentPage = 1;

  onMount(async () => {
    currentPage = 1;
    videos = await fetchMostRecentVideos(currentPage, itemsPerPage);
    paginateVideos();
  });

  function paginateVideos() {
    paginatedVideos = videos;
  }

  async function changePage(direction) {
    if (direction === "next") {
      currentPage++;
    } else if (direction === "prev" && currentPage > 1) {
      currentPage--;
    }
    videos = await fetchMostRecentVideos(currentPage, itemsPerPage);
    paginateVideos();
  }

  // Categories
  let categories = ["Trending", "Most Popular", "Recent"];
  let selectedCategory = categories[0]; // by default, first category is selected

  function selectCategory(category) {
    selectedCategory = category;
  }
</script>

<!-- Categories -->
<div>
  <ul
    class="flex justify-evenly text-center text-white shadow-xl select-none bg-oxfordblue"
    role="tablist"
  >
    {#each categories as category (category)}
      <li
        class="px-4 py-2 m-2 rounded-md cursor-pointer {category ===
        selectedCategory
          ? 'bg-silverlake'
          : 'bg-oxfordblue'} hover:bg-yblue"
        on:click={() => selectCategory(category)}
        on:keydown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            selectCategory(category);
          }
        }}
        role="tab"
        aria-selected={category === selectedCategory}
        tabindex={category === selectedCategory ? 0 : -1}
      >
        {category}
      </li>
    {/each}
  </ul>
</div>

<!-- Videos -->
<div class="text-white">
  <ul
    class="grid grid-cols-1 gap-16 mx-auto mt-auto max-w-screen-xl snap-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-16 lg:mt-10"
  >
    {#each paginatedVideos as video}
      <li
        class="mx-auto w-80 h-48 transition-all transform sm:w-64 sm:h-40 lg:w-80 lg:h-48 hover:scale-110"
      >
        <img
          class="object-cover w-full h-full"
          src="https://img.youtube.com/vi/{video.video_ID}/0.jpg"
          alt={video.name}
        />
        <h1 class="text-sm sm:text-base md:text-lg">{video.title}</h1>
      </li>
    {/each}
  </ul>

  <div class="flex justify-center mt-20 mb-10 space-x-10">
    <button on:click={() => changePage("prev")} disabled={currentPage === 1}>
      <span class="material-icons"> chevron_left </span>
    </button>
    <button on:click={() => changePage("next")}>
      <span class="material-icons"> chevron_right </span>
    </button>
  </div>
</div>

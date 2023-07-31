<script>
  import { onMount } from "svelte";

  const itemsPerPage = 12;

  let videos = [
    { id: "doDKaKDvB30", name: "Svelte Tutorial" },
    { id: "doDKaKDvB30", name: "Svelte Tutorial" },
    { id: "doDKaKDvB30", name: "Svelte Tutorial" },
    { id: "doDKaKDvB30", name: "Svelte Tutorial" },
    { id: "doDKaKDvB30", name: "Svelte Tutorial" },
    { id: "doDKaKDvB30", name: "Svelte Tutorial" },
    { id: "doDKaKDvB30", name: "Svelte Tutorial" },
    { id: "QH2-TGUlwu4", name: "Svelte Tutorial" },
    { id: "doDKaKDvB30", name: "Svelte Tutorial" },
    { id: "doDKaKDvB30", name: "Svelte Tutorial" },
    { id: "doDKaKDvB30", name: "Svelte Tutorial" },
    { id: "doDKaKDvB30", name: "Svelte Tutorial" },
    { id: "doDKaKDvB30", name: "Svelte Tutorial" },
    { id: "doDKaKDvB30", name: "Svelte Tutorial" },
    { id: "doDKaKDvB30", name: "Svelte Tutorial" },
  ];

  let paginatedVideos = [];
  let currentPage = 1;

  onMount(() => {
    currentPage = 1;
    paginateVideos();
  });

  function paginateVideos() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    paginatedVideos = videos.slice(startIndex, endIndex);
  }

  function changePage(direction) {
    if (
      direction === "next" &&
      currentPage < Math.ceil(videos.length / itemsPerPage)
    ) {
      currentPage++;
    } else if (direction === "prev" && currentPage > 1) {
      currentPage--;
    }
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
          src="https://img.youtube.com/vi/{video.id}/0.jpg"
          alt={video.name}
        />
        <h1 class="text-sm sm:text-base md:text-lg">Video ID: {video.id}</h1>
      </li>
    {/each}
  </ul>

  <div class="flex justify-center mt-20 mb-10 space-x-10">
    <button on:click={() => changePage("prev")} disabled={currentPage === 1}>
      <span class="material-icons"> chevron_left </span>
    </button>
    <button
      on:click={() => changePage("next")}
      disabled={currentPage === Math.ceil(videos.length / itemsPerPage)}
    >
      <span class="material-icons"> chevron_right </span>
    </button>
  </div>
</div>

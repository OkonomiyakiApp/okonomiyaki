<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let selectedDay = null;

  function selectDay(date) {
    selectedDay = date;
    dispatch("daySelected", selectedDay);
  }

  let userActivityMap = new Map();

  // Mock data
  let fetchedUserActivityData = [
    { date: "2023-07-09", count: 1 },
    { date: "2023-07-10", count: 2 },
    { date: "2023-07-11", count: 3 },
    { date: "2023-07-12", count: 4 },
    { date: "2023-07-13", count: 5 },
    { date: "2023-07-14", count: 6 },
  ];

  for (let activity of fetchedUserActivityData) {
    userActivityMap.set(activity.date, activity.count);
  }

  // Takes the week and day index and returns a date string in the 'yyyy-mm-dd' format
  function formatDate(weekIndex, dayIndex) {
    const currentDate = new Date();
    const yearAgo = new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    const date = new Date(yearAgo); // Starting from a year ago from the current date
    date.setDate(date.getDate() + weekIndex * 7 + dayIndex);
    return date.toISOString().slice(0, 10); // Format date to 'yyyy-mm-dd'
  }

  function getColor(activityCount) {
    if (activityCount === undefined) {
      return "#1B263B"; // Github's color for no activity
    } else if (activityCount <= 1) {
      return "#9be9a8"; // Light green
    } else if (activityCount <= 3) {
      return "#40c463"; // Medium green
    } else if (activityCount <= 6) {
      return "#30a14e"; // Dark green
    } else {
      return "#216e39"; // Darkest green
    }
  }

  let weeks = [...Array(52)].map((_, i) => i);
  let days = [...Array(7)].map((_, i) => i);
</script>

<div class="flex flex-wrap">
  {#each weeks as week}
    <div class="flex flex-col">
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      {#each days as day}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="mr-2 mb-2 hover:scale-110"
          style={`background-color: ${getColor(
            userActivityMap.get(formatDate(week, day)),
          )}; width: 15px; height: 15px;`}
          on:click={() => selectDay(formatDate(week, day))}
          title={userActivityMap.get(formatDate(week, day))
            ? `${userActivityMap.get(
                formatDate(week, day),
              )} hours done on ${formatDate(week, day)}`
            : "No hours logged on this day"}
        ></div>
      {/each}
    </div>
  {/each}
</div>

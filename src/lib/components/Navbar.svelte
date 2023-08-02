<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { currentUser } from "../../routes/api/auth";

  // Spinning animations
  let spinning = false;
  let spinTimeout = null;
  let imgElement = null;
  let navLinks;

  function startSpin() {
    cancelAnimationFrame(spinTimeout);
    spinning = true;
    spin();
  }

  function stopSpin() {
    spinning = false;
  }

  function spin() {
    const rotation = getRotationDegrees(imgElement);

    if (spinning || (rotation > 1 && rotation < 359)) {
      imgElement.style.transform = `rotate(${rotation + 2}deg)`;
      spinTimeout = requestAnimationFrame(spin);
    }
  }

  function getRotationDegrees(obj) {
    const matrix = window
      .getComputedStyle(obj, null)
      .getPropertyValue("transform");
    if (matrix !== "none") {
      const values = matrix.split("(")[1].split(")")[0].split(",");
      const a = parseFloat(values[0]);
      const b = parseFloat(values[1]);
      const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
      return angle < 0 ? angle + 360 : angle;
    }
    return 0;
  }

  onMount(() => {
    imgElement = document.getElementById("spinning-image");
  });

  // Page links:

  $: routeId = $page.route.id;

  // Subscribe to the currentUser store
  $currentUser;

  // Whenever currentUser changes, this will run and update the navLinks
  $: {
    if ($currentUser) {
      navLinks = [
        { route: "/", icon: "home" },
        { route: "/account", icon: "account_circle" },
        { route: "/tracking", icon: "date_range" },
        { route: "/about", icon: "info" },
      ];
    } else {
      navLinks = [
        { route: "/", icon: "home" },
        { route: "/login", icon: "login" },
        { route: "/tracking", icon: "date_range" },
        { route: "/about", icon: "info" },
      ];
    }
  }
</script>

<div class="flex overflow-hidden flex-col h-screen shadow-xl md:flex-row">
  <div class="px-4 py-6 w-full h-full md:w-64 bg-oxfordblue sm:px-6">
    <!-- Top area -->
    <div class="flex justify-center items-center mb-8">
      <a href="/">
        <img
          id="spinning-image"
          src="/icon.png"
          alt="Logo"
          class="object-cover w-14 h-14"
          on:mouseover={startSpin}
          on:mouseleave={stopSpin}
          on:focus={startSpin}
          on:blur={stopSpin}
        />
      </a>
    </div>
    <!-- Navigation -->
    <nav class="space-y-2">
      {#each navLinks as { route, icon }}
        <a
          href={route}
          class="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-white hover:text-white hover:bg-yblue transition-all {routeId ===
          route
            ? 'bg-silverlake text-richblack'
            : ''}"
        >
          <i class="flex-shrink-0 mr-3 material-icons">{icon}</i>
          {route.replace("/", "") || "home"}
        </a>
      {/each}
    </nav>
  </div>
  <!-- Content area -->
  <div class="overflow-auto flex-1 bg-white md:overflow-visible">
    <slot />
  </div>
</div>

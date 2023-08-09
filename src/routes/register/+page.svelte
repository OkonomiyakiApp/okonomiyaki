<script>
  import { fade, scale } from "svelte/transition";
  import { toast } from "@zerodevx/svelte-toast";
  import { handleRegistrationError } from "../api/errorHandler.js";
  import { register } from "../api/auth.js";

  let email = "";
  let username = "";
  let password = "";
  let passwordConfirm = "";

  let isRegistering = false;

  const handleRegister = async () => {
    if (password !== passwordConfirm) {
      // Handle password mismatch error

      toast.push("Passwords do not match.");
      return;
    }

    if (isRegistering) {
      toast.push("Please wait before doing that again.");
      return;
    }

    isRegistering = true;

    try {
      await register(email, username, password, passwordConfirm);
    } catch (error) {
      const message = handleRegistrationError(error);
      toast.push(message);
    } finally {
      setTimeout(() => {
        isRegistering = false;
      }, 3000);
    }
  };
</script>

<svelte:head>
  <title>Register</title>
</svelte:head>

<div class="flex justify-center items-center min-h-screen">
  <form
    in:fade={{ delay: 250, duration: 500 }}
    class="p-32 w-1/2 rounded-lg shadow-xl bg-oxfordblue"
  >
    <h1
      class="mb-8 text-3xl font-bold text-white"
      style="transform-origin: center; display: inline-block;"
    >
      <span in:scale={{ duration: 1500 }} style="display: block;">Register</span
      >
    </h1>
    <div class="mb-6">
      <label class="block mb-2 text-sm font-bold text-white" for="email">
        Email
      </label>
      <input
        class="px-3 py-2 w-full leading-tight text-gray-700 rounded border shadow appearance-none focus:outline-none focus:shadow-outline"
        id="email"
        type="text"
        placeholder="Email"
        bind:value={email}
      />
    </div>
    <div class="mb-6">
      <label class="block mb-2 text-sm font-bold text-white" for="email">
        Username
      </label>
      <input
        class="px-3 py-2 w-full leading-tight text-gray-700 rounded border shadow appearance-none focus:outline-none focus:shadow-outline"
        id="email"
        type="text"
        placeholder="Username"
        bind:value={username}
      />
    </div>
    <div class="mb-6">
      <label class="block mb-2 text-sm font-bold text-white" for="password">
        Password
      </label>
      <input
        class="px-3 py-2 mb-3 w-full leading-tight text-gray-700 rounded border shadow appearance-none focus:outline-none focus:shadow-outline"
        id="password"
        type="password"
        placeholder="**********"
        bind:value={password}
      />
    </div>
    <div class="mb-6">
      <label
        class="block mb-2 text-sm font-bold text-white"
        for="passwordConfirm"
      >
        Confirm Password
      </label>
      <input
        class="px-3 py-2 mb-3 w-full leading-tight text-gray-700 rounded border shadow appearance-none focus:outline-none focus:shadow-outline"
        id="passwordConfirm"
        type="password"
        placeholder="**********"
        bind:value={passwordConfirm}
      />
    </div>
    <div class="flex justify-between items-center">
      <button
        class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        type="button"
        on:click={handleRegister}
      >
        Register
      </button>
    </div>
    <p class="mt-4 text-white">
      Already have an account? <a href="/login" class="text-blue-500 underline"
        >Sign in</a
      >.
    </p>
  </form>
</div>

<script>
  import { fade, scale } from "svelte/transition";
  import { toast } from "@zerodevx/svelte-toast";
  import { authenticate } from "../api/auth";
  import { handleLoginError } from "../api/errorHandler";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let isLoggingIn = false;

  const handleLogin = async () => {
    if (isLoggingIn) {
      toast.push("Please wait before doing that again.");
      return;
    }
    isLoggingIn = true;
    try {
      await authenticate(email, password);
      goto("/");
      toast.push("Login successful.");
    } catch (error) {
      const message = handleLoginError(error);
      toast.push(message);
    } finally {
      setTimeout(() => {
        isLoggingIn = false;
      }, 3000);
    }
  };
</script>

<div class="flex justify-center items-center min-h-screen">
  <form
    in:fade={{ delay: 250, duration: 500 }}
    class="p-32 w-1/2 rounded-lg shadow-xl bg-oxfordblue"
  >
    <h1
      class="mb-8 text-3xl font-bold text-white"
      style="transform-origin: center; display: inline-block;"
    >
      <span in:scale={{ duration: 1500 }} style="display: block;">Login</span>
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
    <div class="flex justify-between items-center">
      <button
        class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        type="button"
        on:click={handleLogin}
      >
        Log In
      </button>
    </div>
    <p class="mt-4 text-white">
      Not registered yet? <a href="/register" class="text-blue-500 underline"
        >Register now</a
      >.
    </p>
  </form>
</div>

<script>
  import { toast } from "@zerodevx/svelte-toast";
  import { changePassword, currentUser, logOut } from "../api/auth";

  let showModal = false;
  let currentPassword = "";
  let newPassword = "";

  async function onSubmitPasswordChange() {
    try {
      await changePassword(currentPassword, newPassword);
      showModal = false;
      currentPassword = "";
      newPassword = "";
    } catch (error) {
      toast.push("Error. Check to make sure current password is correct.");
    }
  }
</script>

<div class="flex flex-col py-6 mt-28 min-h- screen justify-top">
  <div
    class="overflow-hidden mx-auto w-3/4 max-w-2xl rounded-lg shadow-lg bg-oxfordblue"
  >
    <div class="px-6 py-8 text-center text-white bg-yblue">
      <p class="mb-2 text-5xl">Welcome, {$currentUser?.username}</p>
    </div>

    <div class="p-8 text-center">
      {#if $currentUser?.avatar}
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <!-- TODO See if authData works with this -->
        <img
          class="mx-auto mb-4 w-48 h-48 rounded-full"
          src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/_pb_users_auth_/${$currentUser.id}/${$currentUser.avatar}?token=`}
          alt="Profile Picture"
        />
      {/if}

      <p class="mb-2 text-2xl font-bold text-gray-400">
        {$currentUser?.username}
      </p>
      <p class="mb-1 text-gray-400">Email: {$currentUser?.email}</p>
      <p class="mb-1 text-gray-400">
        Account created on: {$currentUser?.created}
      </p>
      <p class="mb-8 text-gray-400">Bio: {$currentUser?.bio}</p>

      <div class="flex justify-around">
        <button
          class="px-6 py-3 mb-3 w-40 text-2xl font-bold text-white rounded-md bg-yblue"
          on:click={logOut}>Log Out</button
        >
        <button
          class="px-6 py-3 mb-3 w-40 text-2xl font-bold text-white rounded-md bg-yblue"
          on:click={() => (showModal = true)}>Change Password</button
        >
      </div>
    </div>

    <!-- The password change modal -->
    {#if showModal}
      <div
        class="flex fixed inset-0 z-50 justify-center items-center"
        style="background-color: rgba(0, 0, 0, 0.5);"
      >
        <div class="p-6 m-4 w-full max-w-xs bg-white rounded">
          <h2 class="mb-4 text-2xl">Change Password</h2>
          <form on:submit|preventDefault={onSubmitPasswordChange}>
            <div>
              <label for="currentPassword" class="block mb-2"
                >Current Password</label
              >
              <input
                type="password"
                id="currentPassword"
                bind:value={currentPassword}
                class="block p-2 mb-4 w-full rounded border"
                required
              />
            </div>
            <div>
              <label for="newPassword" class="block mb-2">New Password</label>
              <input
                type="password"
                id="newPassword"
                bind:value={newPassword}
                class="block p-2 mb-4 w-full rounded border"
                required
              />
            </div>
            <div class="flex justify-end">
              <button class="p-2 text-white bg-blue-500 rounded" type="submit"
                >Submit</button
              >
              <button
                class="p-2 ml-2 rounded border"
                type="button"
                on:click={() => (showModal = false)}>Cancel</button
              >
            </div>
          </form>
        </div>
      </div>
    {/if}
  </div>
</div>

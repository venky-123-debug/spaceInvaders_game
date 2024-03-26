<script>
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()
  let boostCount = 2
  export let booster = false

  const dispatchBoost = () => {
    booster = true
    boostCount--
    dispatch("boost")
  }
</script>

<div class="absolute left-5 bottom-5 flex items-center justify-center">
  <button on:click={dispatchBoost} disabled={boostCount == 0 || booster} type="button" class="min-w-[36px] rounded-md border-b-4 border-blue-700 bg-blue-500 py-2 px-4 font-bold text-white hover:border-blue-500 hover:bg-blue-400 disabled:cursor-not-allowed">
    Booster
    {#each Array(boostCount) as arr}
      <span><i class="fa-solid fa-plug-circle-bolt text-base text-rose-500" /></span>
    {/each}
    <span class="text-white" />
  </button>
</div>

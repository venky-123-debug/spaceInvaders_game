<script>
  export let boostCount=3
  export let booster = false

  const handleBoost = () => {
    booster = true
    boostCount--
  }
</script>

<div class="absolute left-5 bottom-5 flex items-center justify-center">
  <button on:click={handleBoost} disabled={boostCount == 0 || booster} type="button" class="min-w-[36px] rounded-md border-b-4 border-blue-700 bg-blue-500 py-2 px-4 font-bold text-white hover:border-blue-500 hover:bg-blue-400 disabled:cursor-not-allowed">Booster</button>
  <div class="pl-2 flex gap-2 items-center justify-center">   
    {#each Array(boostCount) as arr}
      <span><i class="fa-solid fa-plug-circle-bolt text-2xl text-rose-500" /></span>
    {/each}
  </div>
</div>

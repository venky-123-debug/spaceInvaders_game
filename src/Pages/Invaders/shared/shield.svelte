<script>
  export let shieldCount=3
  export let shield = false

  const handleBoost = () => {
    shield = true
    shieldCount--
  }
</script>

<div class="absolute left-5 bottom-5 flex items-center justify-center">
  <button on:click={handleBoost} disabled={shieldCount == 0 || shield} type="button" class="min-w-[36px] rounded-md border-b-4 border-blue-700 bg-blue-500 py-2 px-4 font-bold text-white hover:border-blue-500 hover:bg-blue-400 disabled:cursor-not-allowed">Shield</button>
  <div class="pl-2 flex gap-2 items-center justify-center">   
    {#each Array(shieldCount) as arr}
      <span><i class="fa-solid fa-shield text-2xl text-yellow-400 animate-pulse" /></span>
    {/each}
  </div>
</div>

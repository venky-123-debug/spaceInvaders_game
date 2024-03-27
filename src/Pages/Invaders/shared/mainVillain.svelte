<script>
  export let mainVillain={}
  export let enableMainVillain = false
  let x = mainVillain.x
  let y = mainVillain.y

  $: x = mainVillain.x
  $: y = mainVillain.y + 8
</script>

{#if enableMainVillain}
  <div class="absolute text-8xl text-red-500" style="left: {x}%; top: {y}%;}">
    <i class="fa-solid fa-alien-8bit" />
  </div>
{/if}

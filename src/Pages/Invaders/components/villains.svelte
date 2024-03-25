<script>
  export let villain
  export let x = villain.x
  export let y = villain.y

  $: x = villain.x
  $: y = villain.y+5
</script>

<div class="absolute text-xl text-red-500 " style="left: {x}%; top: {y}%;">
  {#if villain.icon == 0}
  <i class="fa-solid fa-alien-8bit" />
  {/if}
</div>

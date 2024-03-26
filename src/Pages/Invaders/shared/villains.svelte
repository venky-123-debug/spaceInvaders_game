<script>
  export let villain
   let x = villain.x
  let y = villain.y
  export let villainColor

  $: x = villain.x
  $: y = villain.y + 8

</script>

<div class="absolute text-xl" style="left: {x}%; top: {y}%;color:{villainColor};}">
  {#if villain.icon == 0}
    <i class="fa-solid fa-alien-8bit" />
  {/if}
</div>

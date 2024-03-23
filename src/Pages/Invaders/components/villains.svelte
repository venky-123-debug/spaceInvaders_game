<script>
  export let villain
  export let x = villain.x
  export let y = villain.y

  $: x = villain.x
  $: y = villain.y
</script>

<div class="relative text-lg text-red-500" style="left: {x}px; top: {y}px;">
  <i class="fa-solid fa-alien-8bit" />
</div>


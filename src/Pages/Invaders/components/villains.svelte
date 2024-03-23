<script>
  export let villain
  export let x = villain.x
  export let y = villain.y

  // Extracting x and y coordinates from the villain object
  $: x = villain.x
  $: y = villain.y
</script>

<div class="relative text-lg text-red-500" style="left: {x}px; top: {y}px;">
  <i class="fa-solid fa-alien-8bit" />
</div>

<!-- <script>
  export let villain
</script>

<div bind:this={villain} class="relative text-red-500 text-lg">
  <i class="fa-solid fa-alien-8bit"></i></div>
 -->

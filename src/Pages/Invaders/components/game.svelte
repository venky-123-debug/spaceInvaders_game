
<script>
  import Player from './ship.svelte'
  let spaceShip
</script>

<div class="relative h-screen w-screen flex justify-center overflow-hidden items-center bg-black">
  <Player bind:spaceShip/>
</div>

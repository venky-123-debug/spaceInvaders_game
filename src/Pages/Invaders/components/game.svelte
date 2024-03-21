<script>
  import Player from "./ship.svelte"
  import Enemy from "./Villain.svelte"
  import { onMount, onDestroy } from "svelte"

  let spaceShip
  const gridWidth = 5; // Number of villains in a row
  const gridHeight = 8; // Number of rows
  const villainWidth = 20; // Width of each villain
  const villainHeight = 20; // Height of each villain
  const moveSpeed = 0.5; // Speed of horizontal movement

  let villains = [];
  let containerWidth = 0;
  let animationFrame;

  onMount(() => {
    containerWidth = window.innerWidth;
    initializeVillains();
    startAnimation();
  });

  onDestroy(() => {
    cancelAnimationFrame(animationFrame);
  });

  const initializeVillains = () => {
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        villains.push({ x: col * (villainWidth + 10), y: row * (villainHeight + 10) });
      }
    }
  };

  const moveVillains = () => {
    villains = villains.map(v => ({ ...v, x: v.x + moveSpeed }));

    // Check if the grid is about to move beyond the window boundaries
    const maxX = Math.max(...villains.map(v => v.x));
    const minX = Math.min(...villains.map(v => v.x));

    if (maxX >= containerWidth) {
      // If the grid is about to move beyond the right edge, shift it back to the left
      villains = villains.map(v => ({ ...v, x: v.x - containerWidth }));
    } else if (minX <= 0) {
      // If the grid is about to move beyond the left edge, shift it back to the right
      villains = villains.map(v => ({ ...v, x: v.x + containerWidth }));
    }

    animationFrame = requestAnimationFrame(moveVillains);
  };

  const startAnimation = () => {
    animationFrame = requestAnimationFrame(moveVillains);
  };
</script>

<div class="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black">
  <div class="villain-grid" style="grid-template-columns: {`repeat(${gridWidth}, 1fr)`}">
    {#each villains as villain}
      <Enemy style="left: {villain.x}px; top: {villain.y}px;" />
    {/each}
  </div>
  <Player bind:spaceShip />
</div>

<style>
  .villain-grid {
    position: absolute;
    display: grid;
    grid-gap: 10px; /* Gap between villains */
    margin-top: 50px; /* Adjust as needed */
  }
</style>

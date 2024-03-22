<script>
  import Player from "./ship.svelte"
  import Enemy from "./villains.svelte"
  import { onMount, onDestroy } from "svelte"

  let spaceShip
  const gridWidth = 20
  const gridHeight = 8
  const villainWidth = 20
  const villainHeight = 20
  const moveSpeed = 0.5

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
  <div class="absolute top-10 grid gap-2" style="grid-template-columns: {`repeat(${gridWidth}, 1fr)`}">
    {#each villains as villain}
      <!-- <div class="villain"></div> -->
      <Enemy bind:villain />
    {/each}
  </div>
  <Player bind:spaceShip />
</div>


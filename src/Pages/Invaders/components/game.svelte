<script>
  import Player from "./ship.svelte"
  import Enemy from "./villains.svelte"
  import { onMount, onDestroy } from "svelte"

  let spaceShip
  const gridWidth = 20
  const gridHeight = 8
  const villainWidth = 20
  const villainHeight = 20
  const stepSize = 5
  const stepInterval = 1000

  let lastFrameTime = 0

  let villains = []
  let containerWidth = 0
  let animationFrame

  onMount(() => {
    containerWidth = window.innerWidth
    initializeVillains()
    startAnimation()
  })

  onDestroy(() => {
    cancelAnimationFrame(animationFrame)
  })

  const initializeVillains = () => {
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        villains.push({ x: col * (villainWidth + 10), y: row * (villainHeight + 10) })
      }
    }

    villains.forEach((villain) => {
      console.log({villain})
      villain.x = villain.x % containerWidth
    })
  }

  const moveVillains = () => {
  villains.forEach((villain) => {
    villain.x = Number(villain.x) + 10;
  });

  // Check if any villain has gone beyond the container width
  let maxX = Math.max(...villains.map((v) => Number(v.x)));
  let minX = Math.min(...villains.map((v) => Number(v.x)));
  // console.log({maxX})
  // console.log({minX})

  if (maxX >= containerWidth) {
    // Wrap villains back to the left side
    villains = villains.map((v) => ({ ...v, x: Number(v.x) - containerWidth }));
  } else if (minX <= 0) {
    // Wrap villains back to the right side
    villains = villains.map((v) => ({ ...v, x: Number(v.x) + containerWidth }));
  }

  // Request the next animation frame
  animationFrame = requestAnimationFrame(moveVillains);
};




  // const moveVillains = () => {
  //   villains.forEach((villain) => {
  //     console.log({ villain})
  //     villain.x = Number(villain.x) + 10
  //   })
  //   let maxX = Math.max(...villains.map((v) => Number(v.x)))
  //   let minX = Math.min(...villains.map((v) => Number(v.x)))

  //   if (maxX >= containerWidth) {
  //     villains = villains.map((v) => ({ ...v, x: Number(v.x) - containerWidth }))
  //   } else if (minX <= 0) {
  //     villains = villains.map((v) => ({ ...v, x: Number(v.x) + containerWidth }))
  //   }

  //   animationFrame = requestAnimationFrame(moveVillains)
  // }

  const startAnimation = () => {
    animationFrame = requestAnimationFrame(moveVillains)
  }
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

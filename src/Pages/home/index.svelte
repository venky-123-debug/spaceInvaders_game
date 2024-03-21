<script>
  import { afterUpdate } from "svelte"

  let isJumping = false
  let obstacles = []

  const jumpDino = (e) => {
    try {
      if (e.code === "Space" && !isJumping) {
        isJumping = true
        setTimeout(() => {
          isJumping = false
        }, 500)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const createObstacle = () => {
    const obstacle = {
      id: Math.random(),
      position: 1000,
    }
    obstacles = [...obstacles, obstacle]
    setTimeout(() => {
      obstacles = obstacles.filter((o) => o.id !== obstacle.id)
    }, 5000)
  }

  afterUpdate(() => {
    setInterval(createObstacle, 2000)
  })
</script>

<svelte:head>
  <title>Arcade Games</title>
</svelte:head>

<svelte:window on:keydown={(e) => jumpDino(e)} />

<div class=" flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-gray-500/50">
  <!-- <div class="relative"> -->
    <div class="w-full pl-40 text-5xl text-red-500" style="transform: translateY({isJumping ? '-100px' : '0'})">
      <i class="fa-solid fa-t-rex" />
    </div>
    {#each obstacles as obstacle}
      <div class="absolute bottom-0" style="left: {obstacle.position}px;">
        <i class="fa-solid fa-cactus" />
      </div>
    {/each}
  <!-- </div> -->
</div>

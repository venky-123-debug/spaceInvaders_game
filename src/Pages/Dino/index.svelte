<script>
  import { afterUpdate } from "svelte"

  let isJumping = false
  let obstacles = []
  let gameOver = false

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

<div class=" flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-gray-900">
  <div class="relative w-full">
    <div class="absolute bottom-0 left-10 w-full text-5xl text-white" style="transform: translateY({isJumping ? '-100px' : '0'})">
      <i class="fa-solid fa-bird" />
    </div>
    {#each obstacles as obstacle}
      <div class="absolute bottom-0" style="left: {obstacle.position}px;">
        <i class="fa-solid fa-cactus text-2xl text-gray-300" />
      </div>
    {/each}
  </div>
</div>

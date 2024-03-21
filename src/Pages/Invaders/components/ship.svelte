<script>
  import { onMount } from "svelte"

  export let spaceShip
  let spaceshipPosition = 0
  let bullets = []

  const moveShip = (e) => {
    if (e.code === "ArrowLeft" && spaceshipPosition > 0) {
      spaceshipPosition -= 10
    } else if (e.code === "ArrowRight" && spaceshipPosition < containerWidth - spaceShip.offsetWidth) {
      spaceshipPosition += 10
    }
  }

  const fireBullet = () => {
    bullets.push({ x: spaceshipPosition + spaceShip.offsetWidth / 2, y: spaceShip.offsetTop })
  }

  const moveBullets = () => {
    bullets = bullets.filter((bullet) => bullet.y > 0)
    bullets.forEach((bullet) => (bullet.y -= 5))
    requestAnimationFrame(moveBullets)
  }

  const handleKeyDown = (e) => {
    if (e.code === "Space") {
      fireBullet()
    }
    moveShip(e)
  }

  let containerWidth = 0

  onMount(() => {
    containerWidth = spaceShip.parentElement.offsetWidth
    requestAnimationFrame(moveBullets)
  })
</script>

<svelte:window on:keydown|stopPropagation={handleKeyDown} />
<div bind:this={spaceShip} class="absolute bottom-10" style="left: {spaceshipPosition}px;">
  <i class="fa-sharp fa-solid fa-person-rifle text-2xl text-white" />
</div>

{#each bullets as bullet}
  <div class="bullet" style="left: {bullet.x}px; top: {bullet.y}px;" />
{/each}

<style>
  .bullet {
    position: absolute;
    width: 5px;
    height: 10px;
    background-color: white;
  }
</style>

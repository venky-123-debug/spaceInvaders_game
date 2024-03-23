<script>
  import { onMount, createEventDispatcher } from "svelte"

  export let spaceShip
  const dispatch = createEventDispatcher()

  let containerWidth = 0
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
    let bullet = { x: spaceShip.getBoundingClientRect().left + spaceShip.offsetWidth / 2.3, y: spaceShip.getBoundingClientRect().top }
    bullets.push(bullet)
    // dispatch("fireEnemy", bullet)
    console.log(bullet.x,bullet.y,bullets)
  }

  const moveBullets = () => {
    bullets = bullets.filter((bullet) => bullet.y > 0)
    bullets.forEach((bullet) => (bullet.y -= 5))
    // console.log({bullets})
    requestAnimationFrame(moveBullets)
    dispatch("shootEnemy", bullets)

    // console.log("moveBullets",{bullets})
  }

  const handleKeyDown = (e) => {
    if (e.code === "Space") {
      fireBullet()
    }
    moveShip(e)
  }

  onMount(() => {
    spaceshipPosition = window.innerWidth / 2
    containerWidth = spaceShip.parentElement.offsetWidth
    requestAnimationFrame(moveBullets)
  })
  
</script>

<svelte:window on:keydown|stopPropagation={handleKeyDown} />
<div bind:this={spaceShip} class="absolute bottom-10" style="left: {spaceshipPosition}px;">
  <i class="fa-solid fa-ufo-beam text-5xl text-white" />
  <!-- <i class="fa-duotone fa-starfighter text-5xl text-white" /> -->
</div>

{#each bullets as bullet}
  <i class="fa-solid fa-golf-ball-tee text-md absolute text-white" style="left: {bullet.x}px; top: {bullet.y}px;" />
{/each}

<script>
  import { onMount, createEventDispatcher } from "svelte"

  export let spaceShip
  const dispatch = createEventDispatcher()

  let containerWidth = 0
  export let spaceshipPosition = 0
  let bullets = []

  const moveShip = (e) => {
    if (e.code === "ArrowLeft" && spaceshipPosition > 0) {
      spaceshipPosition -= 1
    } else if (e.code === "ArrowRight" && spaceshipPosition < 96) {
      spaceshipPosition += 1
      console.log(spaceshipPosition)
    }
  }
  const fireBullet = () => {
    let bullet = { x: spaceshipPosition + 1.3, y: 88 }
    bullets.push(bullet)
  }

  const moveBullets = () => {
    bullets = bullets.filter((bullet) => bullet.y > 0)
    bullets.forEach((bullet) => {
      // console.log("Bullet y before update:", bullet.y)
      let bulletX = bullet.x
      bullet.y -= 2
      let initialY = bullet.y
      // console.log("Bullet y after update:", bullet.y)
      dispatch("shootEnemy", { initialY, bulletX, bullet, bullets }) // Dispatch object with initial and updated positions
    })
    requestAnimationFrame(moveBullets)
  }

  const handleKeyDown = (e) => {
    if (e.code === "Space") {
      fireBullet()
    }
    moveShip(e)
  }

  onMount(() => {
    spaceshipPosition = 50
    containerWidth = spaceShip.parentElement.offsetWidth
    requestAnimationFrame(moveBullets)
  })
</script>

<svelte:window on:keydown|stopPropagation|preventDefault={handleKeyDown} />
<div bind:this={spaceShip} class="absolute bottom-10" style="left: {spaceshipPosition}%;">
  <i class="fa-solid fa-ufo-beam text-5xl text-white" />
  <!-- <i class="fa-duotone fa-starfighter text-5xl text-white" /> -->
</div>

{#each bullets as bullet}
  <i class="fa-solid fa-golf-ball-tee text-md absolute text-white" style="left: {bullet.x}%; top: {bullet.y}%;" />
{/each}

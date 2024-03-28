<script>
  import { onMount, createEventDispatcher } from "svelte"
  import * as Tone from "tone"
  import { initiateEnemySound } from "../script/playSound"

  const dispatch = createEventDispatcher()

  export let spaceShip
  export let spaceshipPosition = 0
  export let spaceshipPositionY = 89
  export let shield = false
  export let startPage = false
  export let isPlayerWon = false

  let containerWidth = 0
  let bullets = []
  // let keyDownStartTime
  // let keyDownEndTime

  const moveShip = (e) => {
    if (e.code === "ArrowLeft" && spaceshipPosition > 0) {
      spaceshipPosition -= 1
    } else if (e.code === "ArrowRight" && spaceshipPosition < 96) {
      spaceshipPosition += 1
    }
  }

  const fireBullet = () => {
    let bullet = { x: spaceshipPosition + 2.5, y: 90 }
    bullets.push(bullet)
  }

  const moveBullets = () => {
    bullets = bullets.filter((bullet) => bullet.y > 0)
    bullets.forEach((bullet) => {
      bullet.y -= 2
      dispatch("shootEnemy", { bullet, bullets })
    })
    requestAnimationFrame(moveBullets)
  }

  const handleKeyDown = (e) => {
    if (e.code === "Space") {
      // keyDownStartTime = Date.now()
      // console.log({keyDownStartTime})
      if (!startPage && !isPlayerWon) {
        initiateEnemySound("assets/mcGun.mp3")
        fireBullet()
      }
    }
    moveShip(e)
  }
  $: {
    console.log({ startPage, isPlayerWon })
  }

  // const handleKeyUp = (e) => {
  //   if (e.code === "Space") {
  //     // keyDownEndTime = Date.now()
  //     // let duration = keyDownEndTime - keyDownStartTime
  //     console.log({duration})
  //     if (duration >= 1000) {
  //       console.log("Spacebar held for more than 3 seconds")
  //     }
  //   }
  // }

  const initiateSound = async () => {
    // Initialize Tone.js if it hasn't been started yet
    if (!Tone.context.state === "running") {
      await Tone.start()
    }

    let bulletSound = new Tone.Player({
      url: "assets/mcGun.mp3",
      // url: "assets/gun.mp3",
      autostart: true,
      onload: () => {
        bulletSound.toDestination().start()
        // setTimeout(() => {
        //   bulletSound.stop()
        // }, 500)
      },
    })
  }

  onMount(() => {
    spaceshipPosition = 50
    containerWidth = spaceShip.parentElement.offsetWidth
    requestAnimationFrame(moveBullets)
  })
</script>

<svelte:window on:keydown|stopPropagation|preventDefault={handleKeyDown} />

<div bind:this={spaceShip} class="absolute" style="left: {spaceshipPosition}%;top:{spaceshipPositionY}%;">
  <div class="rounded-md border-2 p-3 {shield ? ' border-red-600' : ' border-transparent'} ">
    <i class="fa-solid fa-jet-fighter-up text-4xl text-white" />
  </div>
</div>

{#each bullets as bullet}
  <i class="fa-solid fa-golf-ball-tee text-md absolute text-white" style="left: {bullet.x}%; top: {bullet.y}%;" />
{/each}

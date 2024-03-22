<script>
  import Player from "./ship.svelte"
  import Enemy from "./villains.svelte"
  import { onMount, onDestroy, afterUpdate } from "svelte"

  let spaceShip
  let gridWidth = 20
  let gridHeight = 8
  let villainWidth = 20
  let villainHeight = 20
  let intervalTimeOut

  let lastFrameTime = 0

  let villains = []
  let containerWidth = 0
  let animationFrame

  onMount(() => {
    containerWidth = window.innerWidth
    initializeVillains()
  })
  afterUpdate(() => {
    if (villains) {
      moveVillains()
      startAnimation()
    }
  })

  $: moveVillains()

  onDestroy(() => {
    clearTimeout(intervalTimeOut)

    // cancelAnimationFrame(animationFrame)
  })

  const initializeVillains = () => {
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        villains.push({ x: col * (villainWidth + 10), y: row * (villainHeight + 10) })
      }
    }

    villains.forEach((villain) => {
      // console.log({ villain })
      // console.log(typeof villain.x)
      villain.x = villain.x % containerWidth
    })
  }

  // const moveVillains = () => {
  //   try {
  //     intervalTimeOut = setInterval(() => {
  //       console.log({ villains })
  //       for (let i = 0; i < villains.length; i++) {
  //         if (!isNaN(villains[i].x)) {
  //           console.log("villains[i].x", villains[i].x)
  //           villains[i].x = Number(villains[i].x) + 10
  //           console.log("villains[i].x", villains[i].x)

  //           // Check if the last enemy has gone beyond the container width
  //           if (villains[villains.length - 1].x >= containerWidth) {
  //             villains[i].x -= 10
  //           } else if (villains[0].x <= 0) {
  //             villains[i].x += 10
  //           }
  //         } else {
  //           console.error("Invalid x-coordinate detected:", villains[i].x)
  //         }
  //         console.log(villains[i].x)
  //       }
  //     }, 500)
  //   } catch (error) {
  //     clearTimeout(intervalTimeOut)
  //   }
  // }

  const moveVillains = () => {
    try {
      // intervalTimeOut = setInterval(() => {
      for (let i = 0; i < villains.length; i++) {
        // console.log("loops")
        // console.log("loops",villains[i].x)
        // console.log(typeof villains[i].x)

        villains[i].x = Number(villains[i].x) + 10
        // console.log("loops", villains[i].x)

        if (villains[i].x >= containerWidth) {
          villains[i].x = -villainWidth
        }
      }
      // }, 100)
    } catch (error) {
      clearTimeout(intervalTimeOut)
    }
  }

  const startAnimation = () => {
    animationFrame = requestAnimationFrame(moveVillains)
  }

  const killEnemy = (event) => {
    let bullet = event.detail
    console.log({bullet})
    let bulletX = bullet.x
    let bulletY = bullet.y

    // Check collision of each villain with the bullet
    for (let i = 0; i < villains.length; i++) {
      let centerX = villains[i].x + villainWidth / 2
      let centerY = villains[i].y + villainHeight / 2

      let distance = Math.sqrt((bulletX - centerX) ** 2 + (bulletY - centerY) ** 2)

      if (distance < (villainWidth + villainHeight) / 2) {
        villains.splice(i, 1)
        break 
      }
    }
  }
</script>

<div class="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black">
  <div class="absolute top-10 grid gap-2" style="grid-template-columns: {`repeat(${gridWidth}, 1fr)`}">
    {#each villains as villain}
      <Enemy bind:villain />
    {/each}
  </div>
  <Player bind:spaceShip on:fireEnemy={(e) => killEnemy(e)} />
</div>

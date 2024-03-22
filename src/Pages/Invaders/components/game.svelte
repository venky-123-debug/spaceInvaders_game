<script>
  import { onMount, onDestroy, afterUpdate } from "svelte"
  import Player from "./ship.svelte"
  import Enemy from "./villains.svelte"

  let spaceShip
  let gridWidth = 20
  let gridHeight = 8
  let villainWidth = 20
  let villainHeight = 20
  let intervalTimeOut

  let lastFrameTime = 0

  let villains = []
  let enemyBullets = []
  let containerWidth = 0
  let animationFrame
  let emnemyBulletFrame

  onMount(() => {
    containerWidth = window.innerWidth
    initializeVillains()
  })
  afterUpdate(() => {
    if (villains) {
      moveVillains()
      startAnimation()
      enemyFireBullets()
    }
  })

  $: {
    moveVillains()
    startEnemyBulletInterval()
  }

  onDestroy(() => {
    clearTimeout(intervalTimeOut)
  })

  const initializeVillains = () => {
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        villains.push({ x: col * (villainWidth + 10), y: row * (villainHeight + 10) })
      }
    }

    villains.forEach((villain) => {
      villain.x = villain.x % containerWidth
    })
  }

  const moveVillains = () => {
    try {
      for (let i = 0; i < villains.length; i++) {
        villains[i].x = Number(villains[i].x) + 10
        if (villains[i].x >= containerWidth) {
          villains[i].x = -villainWidth
        }
      }
    } catch (error) {
      clearTimeout(intervalTimeOut)
    }
  }

  const startAnimation = () => {
    animationFrame = requestAnimationFrame(moveVillains)
  }

  const startEnemyBulletInterval = () => {
    let interval = 2000 // Interval set to 2 seconds
    intervalTimeOut = setTimeout(() => {
      enemyFireBullets()
      startEnemyBulletInterval()
    }, interval)
  }

  // const enemyFireBullets = () => {
  //   villains.forEach((villain) => {
  //     // Determine the number of bullets to fire (1 or 2)
  //     let numBullets = Math.floor(Math.random()) + 1
  //     console.log({ numBullets })
  //     for (let i = 0; i < numBullets; i++) {
  //       if (Math.random() < 0.4) {
  //         enemyBullets.push({ x: villain.x + villainWidth / 2, y: villain.y + villainHeight })
  //       }
  //     }
  //   })

  //   enemyBullets.forEach((bullet) => {
  //     bullet.y += 2
  //   })

  //   enemyBullets = enemyBullets.filter((bullet) => bullet.y < window.innerHeight)
  // }

//   const enemyFireBullets = () => {
//     // Clear existing bullets
//     enemyBullets = []

//     // Shuffle villains array
//     villains.sort(() => Math.random() - 0.5)

//     // Determine the number of bullets to fire (2 or 3)
//     let numBulletsToFire = Math.floor(Math.random() * 2) + 2

//     // Select numBulletsToFire villains to shoot bullets
//     let selectedVillains = villains.slice(0, numBulletsToFire)

//     selectedVillains.forEach((villain) => {
//         // Fire 2 or 3 bullets from each selected villain
//         let numBullets = Math.floor(Math.random() * 2) + 2

//         for (let i = 0; i < numBullets; i++) {
//             if (Math.random() < 0.4) {
//                 enemyBullets.push({ x: villain.x + villainWidth / 2, y: villain.y + villainHeight })
//             }
//         }
//     })

//     // Move bullets
//     enemyBullets.forEach((bullet) => {
//         bullet.y += 2
//     })

//     // Remove bullets that have gone off-screen
//     enemyBullets = enemyBullets.filter((bullet) => bullet.y < window.innerHeight)
// }


  const killEnemy = (event) => {
    let bullet = event.detail
    let bulletX = bullet.x
    let bulletY = bullet.y

    for (let i = 0; i < villains.length; i++) {
      let centerX = villains[i].x + villainWidth / 2
      let centerY = villains[i].y + villainHeight / 2

      let distance = Math.sqrt((bulletX - centerX) ** 2 + (bulletY - centerY) ** 2)

      if (Math.abs(bulletY - centerY) < villainHeight / 2) {
        if (distance < (villainWidth + villainHeight) / 2) {
          villains.splice(i, 1)
          break
        }
      }
    }
  }
</script>

<div class="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black">
  <div class="absolute top-10 grid gap-2" style="grid-template-columns: {`repeat(${gridWidth}, 1fr)`}">
    {#each villains as villain}
      <Enemy bind:villain />
    {/each}
    {#each enemyBullets as bullet}
      <div class="text-md absolute text-white" style="left: {bullet.x}px; top: {bullet.y}px;"><i class="fa-duotone fa-cloud-bolt" /></div>
    {/each}
  </div>
  <Player bind:spaceShip on:fireEnemy={(e) => killEnemy(e)} />
</div>

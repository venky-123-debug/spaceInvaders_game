<script>
  import { onMount, onDestroy, afterUpdate } from "svelte"
  import Player from "./ship.svelte"
  import Enemy from "./villains.svelte"

  let spaceShip
  let gridWidth = 15
  let gridHeight = 6
  let villainWidth = 3
  let villainHeight = 3
  let intervalTimeOut

  let villains = []
  let enemyBullets = []
  let containerWidth = 0
  let animationFrame

  onMount(() => {
    containerWidth = window.innerWidth
    initializeVillains()
  })

  afterUpdate(() => {
    moveVillains()
    startAnimation()
    enemyFireBullets()
  })

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

  let isMove = true
  const moveVillains = () => {
    try {
      let villainSpeed = 0.7

      if (!isMove) {
        for (let i = 0; i < villains.length; i++) {
          villains[i].x -= villainSpeed
        }
        if (villains[0].x <= -containerWidth / 4) {
          // villains[i].y += 0.3
          isMove = true
        }
      } else {
        for (let i = 0; i < villains.length; i++) {
          villains[i].x += villainSpeed
        }
        if (villains[villains.length - 1].x >= containerWidth / 4) {
          // villains[i].y += 0.3
          isMove = false
        }
      }
      console.log({ isMove })
    } catch (error) {
      clearTimeout(intervalTimeOut)
    }
  }

  const startAnimation = () => {
    animationFrame = requestAnimationFrame(moveVillains)
  }

  const startEnemyBulletInterval = () => {
    let interval = 2000
    intervalTimeOut = setTimeout(() => {
      enemyFireBullets()
      startEnemyBulletInterval()
    }, interval)
  }

  const enemyFireBullets = () => {
    villains.forEach((villain) => {
      let numBullets = Math.floor(Math.random()) + 1
      for (let i = 0; i < numBullets; i++) {
        if (Math.random() < 0.4) {
          enemyBullets.push({ x: villain.x + villainWidth / 2, y: villain.y + villainHeight })
        }
      }
    })
  }

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

<div class="relative flex h-screen w-screen items-center justify-center overflow-hidden" style="background-image: url('assets/spaceInvaders.jpg');">
  <div class="absolute top-3 left-3 text-lg text-white">
    <i class="fa-regular fa-user-alien" />
    &nbsp;Space Invaders
  </div>
  <div class="absolute top-14 grid gap-2" style="grid-template-columns: {`repeat(${gridWidth}, 1fr)`}">
    {#each villains as villain, index}
      <Enemy bind:villain />
    {/each}
    {#each enemyBullets as bullet}
      <div class="text-md absolute text-white" style="left: {bullet.x}px; top: {bullet.y}px;"><i class="fa-duotone fa-cloud-bolt" /></div>
    {/each}
  </div>
  <Player bind:spaceShip on:fireEnemy={(e) => killEnemy(e)} />
</div>

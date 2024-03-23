<script>
  import { onMount, onDestroy, afterUpdate } from "svelte"
  import Player from "./ship.svelte"
  import Enemy from "./villains.svelte"
    import GameOver from "./gameOver.svelte"

  let spaceShip
  let gridWidth = 12
  let gridHeight = 6
  let villainWidth = 3
  let villainHeight = 3
  let intervalTimeOut

  let villains = []
  let enemyBullets = []
  let bullets = []
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
    // checkCollisions()
    gameOver()
  })

  onDestroy(() => {
    clearTimeout(intervalTimeOut)
  })
  let isGameOver = true

  const gameOver = () => {
    if (!isGameOver) {
      let halfWindowHeight = window.innerHeight / 2
      let lastVillainY = villains[villains.length - 1].y

      if (Math.abs(lastVillainY - halfWindowHeight) < 1) {
        isGameOver = true
      }
    }
    console.log({ isGameOver })
  }

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

  const downAliens = async (downSpeed) => {
    try {
      for (let i = 0; i < villains.length; i++) {
        villains[i].y += downSpeed
      }
    } catch (error) {
      console.error(error)
    }
  }
  let isMove = true
  let stepDown = false

  $: console.log({ stepDown })
  const moveVillains = async () => {
    try {
      // let villainSpeed = 1
      let villainSpeed = 0.5
      let downSpeed = 0.05
      if (!isMove) {
        for (let i = 0; i < villains.length; i++) {
          villains[i].x -= villainSpeed
        }
        downAliens(downSpeed)
        if (villains[0].x <= -containerWidth / 4) {
          isMove = true
        }
      } else {
        for (let i = 0; i < villains.length; i++) {
          villains[i].x += villainSpeed
        }
        downAliens(downSpeed)
        if (villains[villains.length - 1].x >= containerWidth / 4) {
          isMove = false
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

  const killEnemy = (e) => {
    try {
      let bullet = e.detail
      let bulletX = bullet.x
      let bulletY = bullet.y

      for (let i = 0; i < villains.length; i++) {
        let villain = villains[i]
        if (bulletY >= villain.y && bulletY <= villain.y + villainHeight && bulletX >= villain.x && bulletX <= villain.x + villainWidth) {
          villains.splice(i, 1)
          break
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const checkCollisions = (e) => {
    bullets = e.detail
    for (let i = 0; i < bullets.length; i++) {
      let bullet = bullets[i]
      console.log({ bullet })
      console.log("villain.x", villains[i].y)
      for (let j = 0; j < villains.length; j++) {
        let villain = villains[j]
        if (bullet.x >= villain.x && bullet.x <= villain.x + villainWidth && bullet.y >= villain.y && bullet.y <= villain.y + villainHeight) {
          bullets.splice(i, 1)
          villains.splice(j, 1)
          break
        }
      }
    }
  }
</script>

<div class="relative flex h-screen w-screen items-center justify-center overflow-hidden" style="background-image: url('assets/spaceInvaders.jpg');">
  {#if isGameOver}
    <GameOver on:click={() => {
      isGameOver=!isGameOver
    }}/>
  {/if}
  <div class="absolute top-3 left-3 text-2xl text-white">
    <i class="fa-regular fa-user-alien" />
    &nbsp;Space Invaders
  </div>
  <div class="absolute top-16 grid gap-2" style="grid-template-columns: {`repeat(${gridWidth}, 1fr)`}">
    {#each villains as villain, index}
      <Enemy bind:villain />
    {/each}
    {#each enemyBullets as bullet}
      <div class="text-md absolute text-white" style="left: {bullet.x}px; top: {bullet.y}px;"><i class="fa-duotone fa-cloud-bolt" /></div>
    {/each}
  </div>
  <Player bind:spaceShip on:fireEnemy={(e) => killEnemy(e)} on:shootEnemy={(e) => checkCollisions(e)} />
</div>

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
  let isMove = true
  let isGameOver = false

  onMount(() => {
    containerWidth = window.innerWidth
    initializeVillains()
  })

  afterUpdate(() => {
    moveVillains()
    startAnimation()
    enemyFireBullets()
    gameOver()
  })

  onDestroy(() => {
    clearTimeout(intervalTimeOut)
  })

  const gameOver = () => {
    if (!isGameOver) {
      let lastVillainY = villains[villains.length - 1].y

      if (lastVillainY >= 85) {
        isGameOver = true
      }
    }
  }

  const initializeVillains = () => {
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        villains.push({ x: col * (villainWidth), y: row * (villainHeight + 2),icon:0 })
      }
    }
    // villains.forEach((villain) => {
    //   villain.x = villain.x % containerWidth
    // })
    console.log(villains);
  }

  const downAliens = async (downSpeed) => {
    try {
      for (let i = 0; i < villains.length; i++) {
        villains[i].y += villainHeight + 2
      }
    } catch (error) {
      console.error(error)
    }
  }
  const moveVillains = async () => {
    try {
      let villainSpeed = 0.1
      let downSpeed = 0.05
      if (!isMove) {
        for (let i = 0; i < villains.length; i++) {
          villains[i].x -= villainSpeed
        }
        // if (villains[0].x <= -containerWidth / 4) {
          if (villains[0].x < 0 ) {
          downAliens(downSpeed)
          isMove = true
        }
      } else {
        for (let i = 0; i < villains.length; i++) {
          villains[i].x += villainSpeed
        }
        if (villains[villains.length - 1].x >=  100) {
          downAliens(downSpeed)
        // if (villains[villains.length - 1].x >= containerWidth / 4) {
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
    let interval = 3000
    intervalTimeOut = setTimeout(() => {
      enemyFireBullets()
      startEnemyBulletInterval()
    }, interval)
  }

  const enemyFireBullets = () => {
    villains.forEach((villain) => {
      let numBullets = Math.floor(Math.random()) + 1
      // let numBullets = Math.floor(Math.random()) + 1
      for (let i = 0; i < numBullets; i++) {
        if (Math.random() < 0.4) {
          enemyBullets.push({ x: villain.x + villainWidth / 2, y: villain.y + villainHeight })
        }
      }
    })
    // enemyBullets.forEach((bullet) => {
    //   bullet.y += 2
    // })

    // enemyBullets = enemyBullets.filter((bullet) => bullet.y < window.innerHeight)
  }

  const checkCollisions = (e) => {
    if (!villains.length) {
      isGameOver = true
      return
    }

    let { bullet, bullets } = e.detail

    // console.log("e.detail",e.detail)

    for (let j = 0; j < villains.length; j++) {
      let villain = villains[j]

      // Calculate the boundaries of the bullet
      let bulletLeft = bullet.x
      let bulletRight = bullet.x + 3
      let bulletTop = bullet.y
      let bulletBottom = bullet.y + 3

      // Calculate the boundaries of the villain
      let villainLeft = villain.x
      let villainRight = villain.x + villainWidth
      let villainTop = villain.y
      let villainBottom = villain.y + villainHeight
      console.log(bulletLeft,bulletTop,villainLeft,villainRight,villainTop,villainBottom);

      if (bulletLeft >= villainLeft && bulletLeft <= villainRight && bulletTop >= villainTop && bulletTop <= villainBottom && villain.icon == 0 ) {
        console.log("matched");
        villain.icon = 1
        bullets.splice(bullets.indexOf(bullet), 1)
        // villains.splice(villain, 1)
        break
      }
    }
  }
</script>

<div class="relative flex h-screen w-screen items-center justify-center overflow-hidden" style="background-image: url('assets/spaceInvaders.jpg');">
  {#if isGameOver}
    <GameOver
      on:click={() => {
        window.location.reload()
        setTimeout(() => {
          isGameOver = !isGameOver
        }, 50)
      }}
    />
  {/if}
  <div class="absolute top-3 left-3 text-2xl text-white">
    <i class="fa-regular fa-user-alien" />
    &nbsp;Space Invaders
  </div>
  <div class="grid px-10" style="grid-template-columns: {`repeat(${gridWidth}, 1fr)`}">
    {#each villains as villain}
      <Enemy bind:villain />
    {/each}
    <!-- {#each enemyBullets as bullet}
      <div class="text-md absolute text-white" style="left: {bullet.x}px; top: {bullet.y}px;"><i class="fa-duotone fa-cloud-bolt" /></div>
    {/each} -->
  </div>
  <Player bind:spaceShip on:shootEnemy={(e) => {
    checkCollisions(e)
  }} />
</div>

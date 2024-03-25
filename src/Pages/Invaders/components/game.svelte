<script>
  import { onMount, onDestroy, afterUpdate } from "svelte"
  import Player from "./ship.svelte"
  import Enemy from "./villains.svelte"
  import GameOver from "./gameOver.svelte"
  import CanvasScreen from "./canvasScreen.svelte"

  let spaceShip
  let gridWidth = 12
  let gridHeight = 6
  let villainWidth = 3
  let villainHeight = 3
  let intervalTimeOut

  let villains = []
  let enemyBullets = []
  let containerWidth = 0
  let animationFrame
  let isMove = true
  let isGameOver = false
  let score = 0

  onMount(() => {
    containerWidth = window.innerWidth
    initializeVillains()
    startEnemyFireLoop()
  })

  afterUpdate(() => {
    moveVillains()
    startAnimation()
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
        villains.push({ x: col * villainWidth, y: row * (villainHeight + 2), icon: 0 })
      }
    }
  }

  const downAliens = async () => {
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
      let villainSpeed = 0.01
      if (!isMove) {
        for (let i = 0; i < villains.length; i++) {
          villains[i].x -= villainSpeed
        }
        if (villains[0].x < 0) {
          downAliens()
          isMove = true
        }
      } else {
        for (let i = 0; i < villains.length; i++) {
          villains[i].x += villainSpeed
        }
        if (villains[villains.length - 1].x >= 100) {
          downAliens()
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

  const checkCollisions = (e) => {
    let { bullet, bullets } = e.detail

    let allVillainsDestroyed = true
    for (let j = 0; j < villains.length; j++) {
      let villain = villains[j]

      let bulletLeft = bullet.x
      let bulletTop = bullet.y
      let villainLeft = villain.x
      let villainRight = villain.x + villainWidth
      let villainTop = villain.y
      let villainBottom = villain.y + villainHeight

      if (bulletLeft >= villainLeft && bulletLeft <= villainRight && bulletTop >= villainTop && bulletTop <= villainBottom && villain.icon === 0) {
        // console.log("matched")
        score += 100
        villain.icon = 1
        bullets.splice(bullets.indexOf(bullet), 1)
        break
      }

      if (villain.icon === 0) {
        allVillainsDestroyed = false
      }
    }

    if (allVillainsDestroyed) {
      isGameOver = true
    }
  }
  const downEnemyBullets = () => {
    for (let i = 0; i < enemyBullets.length; i++) {
      enemyBullets[i].y += 30
    }
  }
  const startEnemyFireLoop = () => {
    downEnemyBullets()
    intervalTimeOut = setInterval(() => {
      // requestAnimationFrame(downEnemyBullets)
      if (!isGameOver) {
        fireEnemyBullet()
      }
    }, 1000)
  }

  const fireEnemyBullet = () => {
    let randomVillainIndex = Math.floor(Math.random() * villains.length)
    let randomVillain = villains[randomVillainIndex]
    let bullet = { x: randomVillain.x + villainWidth / 2, y: randomVillain.y + villainHeight }
    // bullet.y += 5
    enemyBullets = [...enemyBullets, bullet]
    // console.log({enemyBullets})
  }
</script>

<div class="relative h-screen w-screen overflow-hidden">
  {#if isGameOver}
    <GameOver
      {score}
      on:click={() => {
        window.location.reload()
        setTimeout(() => {
          isGameOver = !isGameOver
        }, 50)
      }}
    />
  {/if}
  <CanvasScreen />
  <div class="absolute bottom-3 left-3 text-2xl text-white">
    <i class="fa-regular fa-user-alien" />
    &nbsp;Space Invaders
  </div>
  <div class="absolute bottom-3 right-3 text-2xl text-white">
    <i class="fa-regular fa-user-alien" />
    &nbsp;Score&nbsp;{score ? score : "000"}
  </div>
  <div class="grid pt-24" style="grid-template-columns: {`repeat(${gridWidth}, 1fr)`}">
    {#each villains as villain}
      <Enemy bind:villain />
    {/each}
    {#each enemyBullets as bullet}
      <div class="absolute text-xl text-white" style="left: {bullet.x}%; top: {bullet.y}%;"><i class="fa-solid fa-cloud-bolt" /></div>
    {/each}
  </div>
  <Player
    bind:spaceShip
    on:shootEnemy={(e) => {
      checkCollisions(e)
    }}
  />
</div>

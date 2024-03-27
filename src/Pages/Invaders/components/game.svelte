<script>
  import { onMount, onDestroy, afterUpdate } from "svelte"
  import * as Tone from "tone"
  import Player from "../shared/ship.svelte"
  import Enemy from "../shared/villains.svelte"
  import GameOver from "../shared/gameOver.svelte"
  import CanvasScreen from "./canvasScreen.svelte"
  import StartPage from "./startPage.svelte"
  import Boost from "../shared/shield.svelte"
  import Life from "../shared/life.svelte"
  import EnemyBullet from "../shared/enemyBullet.svelte"
  import MainVillain from "../shared/mainVillain.svelte"
  import {initiateEnemySound} from "../script/playSound"

  let spaceShip
  let gridWidth = 12
  let gridHeight = 6
  let villainWidth = 3
  let villainHeight = 3
  let intervalTimeOut

  let villains = []
  let enemyBullets = []
  let containerWidth = 0
  let isMove = true
  let isGameOver = false
  let isPlayerWon = false
  let score = 0
  let bulletTimer
  let spaceshipPosition
  let spaceshipPositionY
  let fallCount = 3
  let startPage = true
  let villainColor
  let shield = false
  let shieldCount = 3
  let villainSpeed = 0
  let mainVillain
  let mainVillainX = 50
  let mainVillainY = 10
  let enableMainVillain = false
  // let toneAutoStart = false

  let enemyColorArray = ["#ea580c", "#15803d", "#0891b2", "#db2777", "#e11d48"]

  let player = new Tone.Player({
    url: "assets/bgm.mp3",
    autostart: false,
    // autostart: true,
    loop: true,
  }).toDestination()
  const startToneAudio = () => {
    Tone.start()
    player.start()
  }
  onMount(() => {
    if (!startPage && !isPlayerWon) {
      startToneAudio()
    }
    containerWidth = window.innerWidth
    assignRandomColorToVillain()
    if (!startPage) {
      startAction()
    } else {
      if (!isGameOver) {
        fireEnemyBullet()
      }
      initializeVillains()
      startEnemyFireLoop()
      enemyBulletCollision()
    }
  })

  afterUpdate(() => {
    handleShield()
    if (!startPage || !isGameOver) {
      moveVillains()
      startAnimation()
      gameOver()
      initializeMainVillain
    }
  })

  onDestroy(() => {
    clearTimeout(intervalTimeOut, bulletTimer)
  })

  const assignRandomColorToVillain = () => {
    villainColor = enemyColorArray[Math.floor(Math.random() * enemyColorArray.length)]
  }
  const handleShield = () => {
    if (shield) {
      setTimeout(() => {
        shield = false
      }, 5000)
    }
  }

  const gameOver = () => {
    let lastVillainY
    if (!isGameOver) {
      if (villains.length) {
        lastVillainY = villains[villains.length - 1].y
      }
      if (lastVillainY >= 80) {
        isGameOver = true
      }
    }
  }
  const startAction = (e) => {
    startPage = false

    if (e.detail == "Easy") {
      villainSpeed = 0.2
    }
    if (e.detail == "Medium") {
      villainSpeed = 0.4
    }
    if (e.detail == "Hard") {
      villainSpeed = 0.6
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
        villains[i].y += villainHeight
      }
    } catch (error) {
      console.error(error)
    }
  }
  const initializeMainVillain = () => {
    if (enableMainVillain) {
      mainVillain = { x: mainVillainX, y: mainVillainY }
    }
  }
  
  const moveMainVillain = async () => {
    try {
      let canMove = false
      if (!canMove) {        
        mainVillain.x -= villainSpeed
        if (mainVillain.x-20 < 0) {
          mainVillain.y += villainHeight
          canMove = true
        }
      } else {
        mainVillain.x += villainSpeed  
        if (mainVillain.x+30 >= 100) {
          mainVillain.y += villainHeight

          canMove = false
        }
      }
    } catch (error) {
      console.error(error)
      clearTimeout(intervalTimeOut)
    }
  }

  const moveVillains = async () => {
    try {
      // let villainSpeed = 0.2
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
      console.error(error)
      clearTimeout(intervalTimeOut)
    }
  }

  const startAnimation = () => {
    // animationFrame = requestAnimationFrame(moveVillains)
  }

  const checkCollisions = (e) => {
    let { bullet, bullets } = e.detail

 allVillainsDestroyed = true

    for (let j = 0; j < villains.length; j++) {
      let villain = villains[j]
      let bulletLeft = bullet.x
      let bulletTop = bullet.y
      let villainLeft = villain.x
      let villainRight = villain.x + villainWidth
      let villainTop = villain.y
      let villainBottom = villain.y + villainHeight

      if (bulletLeft >= villainLeft && bulletLeft <= villainRight && bulletTop >= villainTop && bulletTop <= villainBottom && villain.icon === 0) {
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
      isPlayerWon = true
    }
  }
  const downEnemyBullets = () => {
    for (let i = 0; i < enemyBullets.length; i++) {
      enemyBullets[i].y += 0.5
    }
  }
  const startEnemyFireLoop = () => {
    intervalTimeOut = setInterval(() => {
      downEnemyBullets()
    }, 15)
  }

  const fireEnemyBullet = () => {
    if (startPage || !isGameOver || isPlayerWon) {
      let randomVillainIndex
      bulletTimer = setInterval(() => {
        for (let i = 0; i < villains.length; i++) {
          if (villains[i].icon == 0) randomVillainIndex = Math.floor(Math.random() * villains.length)
        }
        let randomVillain = villains[randomVillainIndex]
        let bullet = { x: randomVillain.x, y: randomVillain.y }
        enemyBullets = [...enemyBullets, bullet]
      }, 1500)
    }
  }

  // const initiateEnemySound = async (url) => {
  //   // Initialize Tone.js if it hasn't been started yet
  //   if (!Tone.context.state === "running") {
  //     await Tone.start()
  //   }

  //   let bulletSound = new Tone.Player({
  //     url: url,
  //     // url: "assets/gun.mp3",
  //     autostart: true,
  //     onload: () => {
  //       bulletSound.toDestination().start()
  //       // setTimeout(() => {
  //       //   bulletSound.stop()
  //       // }, 500)
  //     },
  //   })
  // }
  const enemyBulletCollision = () => {
    bulletTimer = setInterval(() => {
      for (let i = 0; i < enemyBullets.length; i++) {
        if (fallCount === 0) {
          isGameOver = true
          clearInterval(bulletTimer)
          return
        }
        let distanceRatio = Math.abs(enemyBullets[i].x / spaceshipPosition)
        let ratioY = Math.abs(enemyBullets[i].y / spaceshipPositionY)
        if (distanceRatio >= 0.98 && distanceRatio <= 1.1 && ratioY <= 1 && ratioY >= 0.9) {
          enemyBullets = enemyBullets.filter((ene) => ene.x != enemyBullets[i].x)
          if (!shield) fallCount--
          if (!startPage && !isPlayerWon) {
            initiateEnemySound("assets/hitError.mp3")
          }
        }
      }
    }, 200)
  }

  const gameRestart = () => {
    setTimeout(() => {
      if (isPlayerWon) {
        isPlayerWon = !isPlayerWon
      } else isGameOver = !isGameOver
      villains = []
      initializeVillains()
      fallCount = 3
      shieldCount = 3
      score = 0
    }, 50)
    initializeVillains()
  }

  const gameClose = () => {
    window.location.reload()
  }
  // const toggleMute = () => {
  //   player.mute = !player.mute
  //   console.log(player.mute,player )
  // }
</script>

{#if startPage}
  <StartPage on:start={startAction} />
{:else}
  <div class="relative h-screen w-screen overflow-hidden">
    {#if isGameOver || isPlayerWon}
      <GameOver {score} bind:isGameOver bind:isPlayerWon on:Close={gameClose} on:click={gameRestart} />
    {/if}

    <CanvasScreen />
    <div class="absolute top-3 left-5 text-2xl text-white">
      <!-- <i class="fa-regular fa-user-alien" /> -->
      Space Adventure
    </div>
    <div class="absolute top-3 right-5 text-2xl text-white">
      Score&nbsp;{score ? score : "000"}
    </div>
    <div class="absolute right-5 bottom-5 flex animate-pulse gap-3 text-2xl text-blue-500">
      {#each Array(fallCount) as arr}
        <Life />
      {/each}
      <span class="text-white">Life</span>
    </div>
    <div class="grid pt-24" style="grid-template-columns: {`repeat(${gridWidth}, 1fr)`}">
      {#each villains as villain}
        <Enemy bind:villain bind:villainColor />
      {/each}
      {#each enemyBullets as bullet}
        <EnemyBullet bind:bullet />
      {/each}
    </div>
    <Boost bind:shield bind:shieldCount />

    <MainVillain bind:enableMainVillain bind:mainVillain />

    <Player
      bind:shield
      bind:spaceShip
      bind:spaceshipPosition
      bind:spaceshipPositionY
      bind:isPlayerWon
      bind:startPage
      on:shootEnemy={(e) => {
        checkCollisions(e)
      }}
    />
  </div>
{/if}

<script>
  import { onMount } from "svelte"
  let canvas

  onMount(() => {
    if (canvas) {
      const ctx = canvas.getContext("2d")
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      let numStars = 700
      for (let i = 0; i < numStars; i++) {
        let x = Math.random() * window.innerWidth
        let y = Math.random() * window.innerHeight
        let radius = Math.random() * 2

        // Draw a star-like shape
        ctx.beginPath()
        ctx.moveTo(x, y - radius)
        for (let j = 0; j < 5; j++) {
          ctx.lineTo(x + Math.cos((Math.PI * 2 * j) / 5) * radius, y + Math.sin((Math.PI * 2 * j) / 5) * radius)
          ctx.lineTo(x + Math.cos((Math.PI * 2 * (j + 0.5)) / 5) * (radius / 2), y + Math.sin((Math.PI * 2 * (j + 0.5)) / 5) * (radius / 2))
        }
        ctx.closePath()
        ctx.fillStyle = "#fff"
        ctx.fill()
      }
    }
  })
</script>

<canvas bind:this={canvas} class="flex h-full w-screen bg-black" />

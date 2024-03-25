<script>
  import { onMount } from "svelte"
  let canvas

  onMount(() => {
    if (canvas) {
      const ctx = canvas.getContext("2d")
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      let numDots = 700
      for (let i = 0; i < numDots; i++) {
        let x = Math.random() * window.innerWidth
        let y = Math.random() * window.innerHeight
        let radius = Math.random() * 2
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = "#fff"
        ctx.fill()
      }
    }
  })
</script>

<canvas bind:this={canvas} class="flex h-full w-screen bg-black " />

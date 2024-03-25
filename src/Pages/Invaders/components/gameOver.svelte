<script>
  export let score=0
</script>

<div class="fixed inset-0 z-20 flex h-full flex-col items-center justify-center gap-3 bg-black backdrop-blur-md">

  <div class="absolute top-16 right-16">
    <i class="fa-solid fa-planet-ringed text-3xl text-gray-500"></i>
  </div>
  <div class="absolute top-40 left-36">
    <i class="fa-solid fa-stars text-2xl text-gray-500"></i>
  </div>
  <div class="absolute left-11 bottom-10">
    <i class="fa-solid fa-stars text-xl text-gray-500"></i>
  </div>
  <div class="absolute left-96 bottom-56">
    <i class="fa-solid fa-stars text-xl text-gray-500"></i>
  </div>
  <div class="absolute right-44 bottom-24">
    <i class="fa-solid fa-sparkles text-xl text-gray-500"></i>
  </div>
  <section class="text-gray-600 body-font">
    <div class="container px-5 py-24 mx-auto border border-transparent">
      <div class="xl:w-1/2  w-full mx-auto text-center font-mono text-5xl ">
        Game Over
        <div class="py-4  text-lg text-white">
         Your Score is : {score}
        </div>
        <p class="leading-relaxed text-lg">Play Again ?</p>
        <span class="inline-block h-1 w-10 rounded bg-indigo-500 mt-8 mb-6"></span>
        <div class="flex items-center justify-center gap-5"> 
          <button type="button" on:click class="inline-flex text-white bg-green-500 border-0 py-1.5 px-6 focus:outline-none hover:bg-green-600 rounded-md text-lg">Yes</button>
          <button type="button" class="inline-flex text-white bg-red-500 border-0 py-1.5 px-6 focus:outline-none hover:bg-red-600 rounded-md text-lg">No</button>

        </div>
      </div>
    </div>
  </section>
</div>
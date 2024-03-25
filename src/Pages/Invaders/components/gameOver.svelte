<script>
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()
  export let score = 0
</script>

<div class="fixed inset-0 z-20 flex h-full flex-col items-center justify-center gap-3 bg-black backdrop-blur-md">
  <div class="absolute top-16 right-16">
    <i class="fa-solid fa-planet-ringed text-3xl text-gray-500" />
  </div>
  <div class="absolute top-40 left-36">
    <i class="fa-solid fa-stars text-2xl text-gray-500" />
  </div>
  <div class="absolute left-11 bottom-10">
    <i class="fa-solid fa-stars text-xl text-gray-500" />
  </div>
  <div class="absolute left-96 bottom-56">
    <i class="fa-solid fa-stars text-xl text-gray-500" />
  </div>
  <div class="absolute right-44 bottom-24">
    <i class="fa-solid fa-sparkles text-xl text-gray-500" />
  </div>
  <section class="body-font text-gray-600">
    <div class="container mx-auto border border-transparent px-5 py-24">
      <div class="mx-auto w-full text-center font-mono text-5xl">
        Game Over
        <div class="py-4 text-lg text-white">
          Your Score is : {score}
        </div>
        <p class="text-lg leading-relaxed">Play Again ?</p>
        <span class="mt-8 mb-6 inline-block h-1 w-10 rounded bg-indigo-500" />
        <div class="flex items-center justify-center gap-5">
          <button type="button" on:click class="inline-flex rounded-md border-0 bg-green-500 py-1.5 px-6 text-lg text-white hover:bg-green-600 focus:outline-none">Yes</button>
          <button
            type="button"
            on:click={() => {
              dispatch("Close")
            }}
            class="inline-flex rounded-md border-0 bg-red-500 py-1.5 px-6 text-lg text-white hover:bg-red-600 focus:outline-none"
          >
            No
          </button>
        </div>
      </div>
    </div>
  </section>
</div>

<script>
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  let active = "Easy"

  const dispatchEvent = () => {
    dispatch("start", active)
  }

  const handleDispatch = (e) => {
    if (e.code === "Space") {
      console.log("dipatch event")
      dispatchEvent()
    }
  }
</script>

<svelte:window on:keydown|stopPropagation|preventDefault={handleDispatch} />

<div class="relative isolate h-screen w-screen overflow-hidden bg-gray-900">
  <div class="mx-auto grid max-w-7xl grid-cols-1">
    <div class="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:py-48">
      <div class="mx-auto w-full">
        <div class="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden ring-1 ring-white/5">
          <svg class="absolute inset-0 h-full w-full stroke-gray-700 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
            <defs>
              <pattern id="54f88622-e7f8-4f1d-aaf9-c2f5e46dd1f2" width="200" height="200" x="100%" y="-1" patternUnits="userSpaceOnUse">
                <path d="M130 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="100%" y="-1" class="overflow-visible fill-gray-800/20">
              <path d="M-470.5 0h201v201h-201Z" stroke-width="0" />
            </svg>
            <rect width="100%" height="100%" stroke-width="0" fill="url(#54f88622-e7f8-4f1d-aaf9-c2f5e46dd1f2)" />
          </svg>
          <div class="absolute -left-56 top-[calc(100%-13rem)] transform-gpu blur-3xl lg:left-[max(-14rem,calc(100%-59rem))] lg:top-[calc(50%-7rem)]" aria-hidden="true">
            <div class="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-br from-[#80caff] to-[#4f46e5] opacity-20" style="clip-path: polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)" />
          </div>
        </div>
        <div class="flex items-center justify-center gap-2">
          <div class="w-1/2">
            <div class="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-5xl font-bold leading-snug tracking-wider text-transparent">Space Adventure</div>
            <!-- <div class="pt-10 text-xl font-bold tracking-wider text-white">No 1 Arcade Game</div> -->
          </div>
          <div class="w-1/2">
            <!-- <i class="fa-sharp fa-solid fa-alien-8bit ml-20 bg-gradient-to-r from-orange-800 to-cyan-600 bg-clip-text text-7xl text-transparent" /> -->
          </div>
        </div>

        <span class="isolate flex w-full items-center justify-center rounded-md pt-24 text-center shadow-sm">
          <button
            type="button"
            on:click={() => {
              active = "Easy"
            }}
            class="relative inline-flex {active == 'Easy' ? 'active' : 'inactive'} items-center rounded-l-md px-5 py-3 text-sm font-semibold text-gray-500 ring-1 ring-inset"
          >
            Easy
          </button>
          <button
            type="button"
            on:click={() => {
              active = "Medium"
            }}
            class="relative {active == 'Medium' ? 'active' : 'inactive'} -ml-px inline-flex items-center px-5 py-3 text-sm font-semibold text-gray-500 ring-1 ring-inset"
          >
            Medium
          </button>
          <button
            type="button"
            on:click={() => {
              active = "Hard"
            }}
            class="relative {active == 'Hard' ? 'active' : 'inactive'} -ml-2px inline-flex items-center rounded-r-md px-5 py-3 text-sm font-semibold text-gray-500 ring-1 ring-inset"
          >
            Hard
          </button>
        </span>
        <div class="flex items-center justify-center">
          <button on:click={dispatchEvent} type="button" class="mt-10 flex h-9 min-h-full min-w-[36px] items-center justify-center px-3 py-1.5 text-xl font-medium text-white">
            <span class="select-none">
              press <span class="animate-pulse bg-gradient-to-r from-lime-600 to-yellow-500 bg-clip-text text-transparent">SPACE</span>
              to start
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .active {
    @apply bg-white;
  }
  .inactive {
    @apply border-2 border-slate-800;
  }
</style>

import ErrorCode404 from "./Pages/404/index.svelte"
import Home from "./Pages/home/index.svelte"

export default {
  "/":Home,
  // The catch-all route must always be last
  "*": ErrorCode404,
}

<script lang="ts">
  // The following icons come from https://github.com/microsoft/vscode-codicons
  import ArrowSmallLeft from "./svg/arrow-small-left.svelte"
  import ArrowSmallRight from "./svg/arrow-small-right.svelte"
  import CircleFilled from "./svg/circle-filled.svelte"
  import Error from "./svg/error.svelte"

  type IconName = keyof typeof icons

  const icons = {
    "arrow-left": ArrowSmallLeft,
    "arrow-right": ArrowSmallRight,
    "circle-filled": CircleFilled,
    error: Error,
  }

  export let name: IconName

  $: icon = icons[name]
</script>

{#if icon}
  <svelte:component this={icon} {...$$props} />
{/if}

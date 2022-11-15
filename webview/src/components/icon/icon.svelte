<script lang="ts">
  // The following icons come from https://github.com/microsoft/vscode-codicons
  import CircleFilled from "./svg/circle-filled.svelte"
  import ArrowSmallLeft from "./svg/arrow-small-left.svelte"
  import ArrowSmallRight from "./svg/arrow-small-right.svelte"

  type IconName = keyof typeof icons

  const icons = {
    "circle-filled": CircleFilled,
    "arrow-left": ArrowSmallLeft,
    "arrow-right": ArrowSmallRight,
  }

  export let name: IconName

  $: icon = icons[name]
</script>

{#if icon}
  <svelte:component this={icon} {...$$props} />
{/if}

<!-- TODO: use vscode-button here instead when there is better form support -->
<button {...$$props} type="submit"><slot /></button>

<style>
  button {
    outline: none;
    font-family: var(--font-family);
    font-size: var(--type-ramp-base-font-size);
    line-height: var(--type-ramp-base-line-height);
    color: var(--button-primary-foreground);
    background: var(--button-primary-background);
    border-radius: 2px;
    fill: currentcolor;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: var(--button-padding-vertical) var(--button-padding-horizontal);
    outline: none;
    text-decoration: none;
    border: calc(var(--border-width) * 1px) solid var(--button-border);
  }

  button:hover {
    background: var(--button-primary-hover-background);
  }

  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>

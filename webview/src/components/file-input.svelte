<script lang="ts">
  import { Add } from "svelte-codicons"
  export let id: string
  export let required: boolean = false
  type FileEventTarget = EventTarget & { files: FileList }

  const defaultText = "No file chosen"

  function handleOnChange(e: Event) {
    const target = e.target as FileEventTarget
    const fileChosen = document.getElementById(`${id}-file-chosen`)

    if (fileChosen instanceof HTMLElement) {
      const file = target.files[0]
      fileChosen.textContent = file?.name ?? defaultText
    }
  }
</script>

<div class="file-input">
  <input {id} on:change={handleOnChange} type="file" {required} name={id} hidden />
  <vscode-button appearance="secondary">
    <div class="file-button">
      <Add />
      <label class="file-label" for={id}>Choose file</label>
    </div>
  </vscode-button>
  <span class="file-chosen" id="{id}-file-chosen">{defaultText}</span>
</div>

<style>
  .file-input {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
  }
  .file-label {
    margin-left: 0.5rem;
  }
  .file-chosen {
    margin-left: 0.5rem;
  }
  .file-button {
    display: flex;
    align-items: center;
  }
</style>

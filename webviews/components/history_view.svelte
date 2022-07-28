<script lang="ts">
  import file from "./main_view.svelte"
  const json = JSON.stringify(file);
</script>

<head>
  <title>Project Workflow panel</title>
</head>

<body>
  <h1>[ ]Workflow Task</h1>

  <p>{json}</p>
  <p>Command out 1</p>
  <p>Event in 2</p>
  <p>Command out 2</p>
</body>

<style>
</style>

<script lang="ts">
</script>

<head>
  <title>Project Workflow panel</title>
</head>

<body>
  <h1>[ ]Workflow Task</h1>

  <p class="event">Event in 1</p>
  <p class="command">Command out 1</p>
  <p class="event">Event in 2</p>
  <p class="command">Command out 2</p>
  <!-- <script src="script.js"></script> -->
</body>

<style>
  .event:before {
    content: ">";
  }
  .command:before {
    content: "<";
  }
</style>

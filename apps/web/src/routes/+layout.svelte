<script>
  import './water.css'
</script>

<header>
  <h1>Pomo</h1>

  <nav>
    <ul>
      <li>
        <a href="/edit">Add</a>
      </li>
      <li>
        <a href="/log">Log</a>
      </li>
      <li>
        <a href="/week">Week</a>
      </li>
    </ul>
  </nav>
</header>

<slot />

<style>
  :global(body) {
    max-width: none;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  nav ul {
    display: flex;
    padding: 0;
  }
  nav li {
    list-style-type: none;
    margin-right: 1rem;
  }
</style>

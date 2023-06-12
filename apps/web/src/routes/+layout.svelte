<header>
  <h1>Pomo</h1>

  <nav>
    <ul>
      <li>
        <a href='/edit'>Edit</a>
      </li>
      <li>
        <a href='/log'>Log</a>
      </li>
    </ul>
  </nav>
</header>

<slot />

<style>
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

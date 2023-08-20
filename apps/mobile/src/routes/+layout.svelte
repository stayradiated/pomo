<script lang="ts">
  import './water.css'
  import { afterNavigate } from '$app/navigation';

  let menuOpen = false
  const toggleMenuOpen = () => menuOpen = !menuOpen;

  afterNavigate(() => menuOpen = false)
</script>

<header>
  <h1>Pomo</h1>

  <nav class:menuOpen={menuOpen}>
    <div class="menuContainer">
      <a href="/add">Add</a>
      <a href="/quick-add">Quick Add</a>
      <a href="/log">Log</a>
      <a href="/calendar/day">Calendar</a>
      <a href="/label">Labels</a>
      <a href="/sync">Sync</a>
    </div>
    <button
      class="menuToggle"
      aria-hidden="true"
      on:click={toggleMenuOpen}
    >Menu</button>
  </nav>
</header>

<slot />

<style>
  :global(body) {
    max-width: none;
    overscroll-behavior-y: contain;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  nav {
    max-width: 1200px;
    display: flex;
    align-items: center;
    margin: auto;
  }

  .menuContainer > a {
    margin-left: 20px;
  }

  .menuToggle {
    display: none;
  }

  @media (max-width: 768px) {
    .menuContainer {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 100vh;
      height: -webkit-fill-available;
      
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;

      margin: 0;
      padding-left: 7vw;
      padding-right: 7vw;

      background: lightblue;
      z-index: 10;

      opacity: 0;
      transform: translateY(-100%);
      transition: transform 0.2s, opacity 0.2s;
    }

    nav.menuOpen > .menuContainer {
      opacity: 1;
      transform: translateY(0);
    }

    .menuToggle {
      display: initial;
      z-index: 11;
    }
  }
</style>

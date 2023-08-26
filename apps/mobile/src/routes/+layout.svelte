<script lang="ts">
  import './pollen.css'
  import 'normalize.css'
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
  :global(html) {
    --theme-background-body: white;
    --theme-background: var(--color-grey-100);
    --theme-background-alt: var(--color-grey-50);
    --theme-selection: #9e9e9e;
    --theme-text-main: var(--color-grey-800);
    --theme-text-bright: var(--color-black);
    --theme-text-muted: var(--color-grey-600);
    --theme-links: var(--color-blue-500);
    --theme-focus: #0096bfab;
    --theme-border: var(--color-grey-200);
    --theme-code: #000;
    --theme-animation-duration: 0.1s;
    --theme-button-base: #d0cfcf;
    --theme-button-hover: #9b9b9b;
    --theme-scrollbar-thumb: rgb(170, 170, 170);
    --theme-scrollbar-thumb-hover: var(--theme-button-hover);
    --theme-form-placeholder: #949494;
    --theme-form-text: #1d1d1d;
    --theme-variable: #39a33c;
    --theme-highlight: #ff0;
  }

  :global(html[data-theme="dark"]) {
    --theme-background-body: var(--color-black);
    --theme-background: var(--color-grey-800);
    --theme-background-alt: var(--color-grey-700);
    --theme-selection: #1c76c5;
    --theme-text-main: #dbdbdb;
    --theme-text-bright: #fff;
    --theme-text-muted: #a9b1ba;
    --theme-links: #41adff;
    --theme-focus: #0096bfab;
    --theme-border: var(--color-grey-700);
    --theme-code: #ffbe85;
    --theme-animation-duration: 0.1s;
    --theme-button-base: #0c151c;
    --theme-button-hover: #040a0f;
    --theme-scrollbar-thumb: var(--theme-button-hover);
    --theme-scrollbar-thumb-hover: rgb(0, 0, 0);
    --theme-form-placeholder: #a9a9a9;
    --theme-form-text: #fff;
    --theme-variable: #d941e2;
    --theme-highlight: #efdb43;
  }

  :global(body) {
    max-width: none;
    overscroll-behavior-y: contain;
    background: var(--theme-background-body);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    color: var(--theme-text-muted);
  }

  nav {
    max-width: 1200px;
    display: flex;
    align-items: center;
    margin: auto;
  }

  .menuContainer > a {
    margin-left: 20px;
    color: var(--theme-text-muted);
    text-decoration: none;
  }
  .menuContainer > a:hover {
    color: var(--theme-text-main);
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
      align-items: center;

      margin: 0;
      padding-left: 7vw;
      padding-right: 7vw;

      background: var(--color-grey-800);
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

    .menuContainer > a {
      margin: 0;
      font-size: var(--scale-3);
      font-weight: var(--weight-bold);
      line-height: var(--line-xl);
      color: var(--color-grey-100);
    }
  }

  @supports(padding:max(0px)) {
    body, header, footer {
      padding-left: min(0vmin, env(safe-area-inset-left));
      padding-right: min(0vmin, env(safe-area-inset-right));
    }
  }
</style>

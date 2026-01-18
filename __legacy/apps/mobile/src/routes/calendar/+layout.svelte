<script lang="ts">
interface Props {
  children?: import('svelte').Snippet
}

let { children }: Props = $props()
</script>

<nav>
	<ul>
		<li><a href="/calendar/day">Day</a></li>
		<li><a href="/calendar/week">Week</a></li>
	</ul>
</nav>

{@render children?.()}

<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import { onMount } from 'svelte';
	import { initializeWebSocket } from '$lib/stores/websocket';

	onMount(() => {
		initializeWebSocket('wss://quackposter.onrender.com');
	});
</script>

{@render children()}

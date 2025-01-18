<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import { onMount } from 'svelte';
	import { initializeWebSocket } from '$lib/stores/websocket.ts';

	onMount(() => {
		initializeWebSocket('ws://localhost:8080/?room=room1');
	});
</script>

{@render children()}

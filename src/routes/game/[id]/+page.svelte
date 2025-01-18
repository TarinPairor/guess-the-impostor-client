<script context="module">
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';

	let inputValue = writable('');
	let formData = writable({});
	let socketMessages = writable<string[]>([]);

	function handleSubmit() {
		inputValue.subscribe((value) => {
			console.log('Input Value:', value);
		});
	}

	function handleFormSubmit(event: SubmitEvent) {
		event.preventDefault();
		const form = new FormData(event.target as HTMLFormElement);
		const data = Object.fromEntries(form.entries());
		formData.set(data);
		console.log('Form Data:', data);
	}

	const socket = new WebSocket('ws://your-websocket-url');

	socket.addEventListener('message', (event) => {
		socketMessages.update((messages) => [...messages, event.data]);
	});
</script>

<main class="p-4">
	<h1 class="mb-4 bg-red-500 text-2xl font-bold">ID: {$page.params.id}</h1>
	<p class="text-lg">Message: {$page.data.message}</p>

	<div class="mt-4">
		<input
			type="text"
			bind:value={$inputValue}
			class="border p-2"
			placeholder="Enter something..."
		/>
		<button on:click={handleSubmit} class="ml-2 bg-blue-500 p-2 text-white">Submit</button>
	</div>

	<form on:submit={handleFormSubmit} class="mt-4">
		<input type="text" name="field1" class="mb-2 border p-2" placeholder="Field 1" />
		<input type="text" name="field2" class="mb-2 border p-2" placeholder="Field 2" />
		<button type="submit" class="bg-green-500 p-2 text-white">Submit Form</button>
	</form>

	<div class="mt-4">
		<h2 class="text-xl font-bold">WebSocket Messages</h2>
		<ul>
			{#each $socketMessages as message}
				<li class="border-b p-2">{message}</li>
			{/each}
		</ul>
	</div>
</main>

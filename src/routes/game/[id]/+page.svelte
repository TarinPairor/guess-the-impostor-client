<script context="module">
</script>

<script lang="ts">
	import { page } from '$app/state';
	import { writable } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';
	import { websocket } from '$lib/stores/websocket';

	let inputValue = writable('');
	let formData = writable({});
	let socketMessages = writable<string[]>([]);
	let selectedOption: number | null = null;
	let socket: WebSocket | null = null;
	let messages: string[] = [];
	const options = [1, 2, 3, 4];
	let isVoting = false;

	$: if ($websocket) {
		socket = $websocket;
		socket.addEventListener('message', (event: MessageEvent) => {
			console.log('Message received on game page xdd:', event.data);
			messages = [...messages, event.data]; // Store received messages
		});
	}

	onDestroy(() => {
		if (socket) {
			socket.removeEventListener('message', () => {});
		}
	});

	function handleDropdown() {
		console.log(`Selected option: ${selectedOption}`);
		selectedOption = null;
		isVoting = false;
	}

	function handleSubmit() {
		console.log($inputValue);
		inputValue.set('');
		isVoting = true;
	}
</script>

<main class="h-screen p-4">
	<div class="flex h-10 w-full flex-row-reverse">
		<button class="ml-2 bg-blue-500 p-2 text-white">Start</button>
	</div>
	<div class="mt-40 h-20 w-full justify-center text-center text-3xl">
		{#if isVoting}
			'Question: What is the name of the player?'
		{:else}
			'Who do you think is the imposter'
		{/if}
	</div>
	<div class="h-20 w-full justify-center text-center align-middle text-xl">
		{#if !isVoting}
			<input type="text" bind:value={$inputValue} class="border p-2" placeholder="Answer" />
			<button on:click={handleSubmit} class="ml-2 bg-blue-500 p-2 text-white">Submit</button>
		{:else}
			<select
				id="options"
				bind:value={selectedOption}
				class="mt-2 w-[30%] rounded-md border border-gray-300 p-2"
			>
				<option disabled value={null}>Select an option</option>
				{#each options as option}
					<option value={option}>Player {option}</option>
				{/each}
			</select>
			<button
				on:click={handleDropdown}
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
			>
				Submit
			</button>
		{/if}
	</div>
	<div class="absolute inset-x-0 bottom-0 flex h-40 flex-col text-lg">
		<div class="flex h-16 flex-row">
			<div class="flex-auto content-center justify-center text-center">Answer 1</div>
			<div class="flex-auto content-center justify-center text-center">Answer 2</div>
			<div class="flex-auto content-center justify-center text-center">Answer 3</div>
			<div class="flex-auto content-center justify-center text-center">Answer 4</div>
		</div>
		<div class="flex h-full flex-row">
			<div class="flex-auto content-center justify-center border border-b-2 text-center">
				Player 1
			</div>
			<div class="flex-auto content-center justify-center border border-b-2 text-center">
				Player 2
			</div>
			<div class="flex-auto content-center justify-center border border-b-2 text-center">
				Player 3
			</div>
			<div class="flex-auto content-center justify-center border border-b-2 text-center">
				Waiting...
			</div>
		</div>
	</div>
</main>

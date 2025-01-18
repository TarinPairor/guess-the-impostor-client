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

<main class="h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-8 text-white">
	<div class="flex justify-end p-4">
		<button
			class="ml-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-pink-600"
		>
			Start
		</button>
	</div>
	<div class="mt-20 flex flex-col items-center space-y-8">
		<div class="text-3xl font-extrabold text-purple-300">
			{#if isVoting}
				<span>Question: What is the name of the player?</span>
			{:else}
				<span>Who do you think is the imposter?</span>
			{/if}
		</div>
		<div class="w-full max-w-xl text-center">
			{#if !isVoting}
				<div class="flex items-center justify-center space-x-4">
					<input
						type="text"
						bind:value={$inputValue}
						class="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
						placeholder="Answer"
					/>
					<button
						on:click={handleDropdown}
						class="rounded bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-pink-600"
					>
						Submit
					</button>
				</div>
			{:else}
				<div class="flex flex-col items-center">
					<select
						id="options"
						bind:value={selectedOption}
						class="mt-4 w-[70%] rounded-lg border border-gray-700 bg-gray-800 p-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
					>
						<option disabled value={null}>Select an option</option>
						{#each options as option}
							<option value={option}>Player {option}</option>
						{/each}
					</select>
					<button
						on:click={handleDropdown}
						class="mt-4 rounded bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-pink-600"
					>
						Submit
					</button>
				</div>
			{/if}
		</div>
	</div>
	<div class="absolute inset-x-0 bottom-0 flex h-40 flex-col text-lg">
		<div class="flex h-16 flex-row">
			<div class="flex-auto text-center font-semibold text-purple-300">Answer 1</div>
			<div class="flex-auto text-center font-semibold text-purple-300">Answer 2</div>
			<div class="flex-auto text-center font-semibold text-purple-300">Answer 3</div>
			<div class="flex-auto text-center font-semibold text-purple-300">Waiting...</div>
		</div>
		<div class="flex h-full flex-row">
			<div class="flex-auto border border-gray-700 text-center text-gray-300">Player 1</div>
			<div class="flex-auto border border-gray-700 text-center text-gray-300">Player 2</div>
			<div class="flex-auto border border-gray-700 text-center text-gray-300">Player 3</div>
			<div class="flex-auto border border-gray-700 text-center text-gray-300">Waiting...</div>
		</div>
	</div>
</main>

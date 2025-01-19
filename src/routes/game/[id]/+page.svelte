<script context="module">
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { writable, get } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';
	import { websocket } from '$lib/stores/websocket';
	import { goto } from '$app/navigation';
	import { json } from '@sveltejs/kit';
	import { playerRole } from '$lib/stores/playerStore';

	let currentPageId: string;
	let inputValue = writable('');
	let selectedOption: number | null = null;
	let socket: WebSocket | null = null;
	let messages: string[] = [];
	const options = [1, 2, 3, 4];
	let isGameStart = false;
	let isVoting = false;
	let isFinalRound = false;
	let currentQuestion = '';
	let role: number | null;

	$: playerRole.subscribe((value) => (role = value));

	let numPlayers: number = get(playerRole) ?? 0;

	$: currentPageId = $page.params.id;

	$: if ($websocket) {
		socket = $websocket;
		socket.addEventListener('message', (event: MessageEvent) => {
			try {
				let msgData = JSON.parse(event.data);
				if (msgData.action == 'startRound') {
					currentQuestion = msgData.question;
					isFinalRound = msgData.isLastRound;
					isGameStart = true;
				}
			} catch (e) {
				console.log('Error');
			}
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
		if (socket && socket.readyState === WebSocket.OPEN) {
			const message = { action: 'updateAnswerok', roomId: currentPageId, msg: $inputValue };
			socket.send(JSON.stringify(message)); // Send a message to the WebSocket server
		}
		inputValue.set('');
		if (isFinalRound) isVoting = true;
	}

	function handleStart() {
		if (socket && socket.readyState === WebSocket.OPEN) {
			const message = { action: 'startRound', roomId: currentPageId };
			socket.send(JSON.stringify(message)); // Send a message to the WebSocket server
		}
	}
</script>

<main class="h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-8 text-white">
	<div class="flex justify-end p-4">
		<!-- <button
			disabled={numPlayers < 4} -->
		<button
			on:click={() => {
				handleStart();
			}}
			class="ml-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
		>
			Start
		</button>
	</div>
	<div class="flex justify-end p-4">
		<button
			on:click={() => {
				goto('/');
			}}
			class="ml-2 rounded bg-gradient-to-r from-pink-500 to-blue-500 px-4 py-2 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-pink-600"
		>
			Home
		</button>
	</div>
	{#if !isGameStart}
		<div class="mt-40 flex flex-col items-center text-3xl font-extrabold text-purple-300">
			<b>Waiting for players...</b>
		</div>
	{:else}
		<div class="mt-20 flex flex-col items-center space-y-8">
			<div class="text-3xl font-extrabold text-purple-300">
				{#if !isVoting}
					<span>{currentQuestion}</span>
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
							on:click={handleSubmit}
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
		<div class="mt-12 h-12 w-full items-center justify-center text-center text-2xl">
			Your word is <strong>Cringe</strong>
		</div>
	{/if}
	<div class="absolute inset-x-0 bottom-0 flex h-40 flex-col text-lg">
		{#if isVoting}
			<div class="flex h-16 flex-row">
				<div class="w-[25%] text-center font-semibold text-purple-300">Answer 1</div>
				<div class="w-[25%] text-center font-semibold text-purple-300">Answer 2</div>
				<div class="w-[25%] text-center font-semibold text-purple-300">Answer 3</div>
				<div class="w-[25%] text-center font-semibold text-purple-300">Answer 4</div>
			</div>
		{/if}
		<div class="flex h-full flex-row">
			{#each Array(4)
				.fill(0)
				.map((_, i) => i + 1) as playerNumber}
				<div
					class="flex h-full w-[25%] items-center justify-center border border-gray-700 text-gray-300"
				>
					{#if playerNumber === role}
						Me
					{:else if playerNumber > numPlayers}
						Waiting...
					{:else}
						Player {playerNumber}
					{/if}
				</div>
			{/each}
		</div>
	</div>
</main>

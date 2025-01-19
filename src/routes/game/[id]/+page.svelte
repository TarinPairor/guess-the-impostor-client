<script context="module">
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { writable, get } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';
	import { websocket } from '$lib/stores/websocket';
	import { goto } from '$app/navigation';
	import { json } from '@sveltejs/kit';
	import { playerRole, playerWord } from '$lib/stores/playerStore';

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
	let currentWord: string | null = '';
	let answers: string[] | null = null;

	$: playerRole.subscribe((value) => (role = value));
	$: playerWord.subscribe((value) => (currentWord = value));

	let numPlayers: number = get(playerRole) ?? 0;

	$: currentPageId = $page.params.id;

	let votes = [0, 0, 0, 0];

	$: if ($websocket) {
		socket = $websocket;
		socket.addEventListener('message', (event: MessageEvent) => {
			try {
				let msgData = JSON.parse(event.data);
				if (msgData.action == 'startRound') {
					currentQuestion = msgData.question;
					console.log(msgData.question);
					isFinalRound = msgData.isLastRound;
					isGameStart = true;
					setTimeout(() => {
						getAnswer();
					}, 15000);
				}
				if (msgData.action == 'joinAlert') {
					numPlayers = numPlayers + 1;
				}
				if (msgData.action == 'sendWord') {
					playerWord.set(msgData.word);
				}
				if (msgData.action == 'getAnswer') {
					answers = msgData.answers;
				}
				if (msgData.action == 'getVotes') {
					votes = msgData.votes;
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
		if (socket && socket.readyState === WebSocket.OPEN && selectedOption != null) {
			const message = {
				action: 'updateVotes',
				roomId: currentPageId,
				playerIndex: selectedOption - 1
			};
			socket.send(JSON.stringify(message)); // Send a message to the WebSocket server
		}
		setTimeout(() => {
			getVotes();
		}, 15000);
	}

	function handleSubmit() {
		console.log($inputValue);
		if (socket && socket.readyState === WebSocket.OPEN) {
			const message = { action: 'updateAnswer', roomId: currentPageId, msg: $inputValue };
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

	function getAnswer() {
		if (socket && socket.readyState === WebSocket.OPEN) {
			const message = { action: 'getAnswer', roomId: currentPageId };
			socket.send(JSON.stringify(message)); // Send a message to the WebSocket server
		}
	}

	function getVotes() {
		if (socket && socket.readyState === WebSocket.OPEN) {
			const message = { action: 'getVotes', roomId: currentPageId };
			socket.send(JSON.stringify(message)); // Send a message to the WebSocket server
		}
	}
</script>

<main class="h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-8 text-white">
	{#if role == 1}
		<div class="flex justify-end p-4">
			<button
				on:click={() => {
					handleStart();
				}}
				disabled={numPlayers < 4}
				class="ml-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Start
			</button>
		</div>
	{/if}
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
			Your word is <strong>{currentWord}</strong>
		</div>
	{/if}
	<div class="absolute inset-x-0 bottom-0 flex h-40 flex-col text-lg">
		{#if !isVoting}
			<div class="flex h-16 flex-row">
				<!-- <div class="w-[25%] text-center font-semibold text-purple-300">Answer 1</div>
				<div class="w-[25%] text-center font-semibold text-purple-300">Answer 2</div>
				<div class="w-[25%] text-center font-semibold text-purple-300">Answer 3</div>
				<div class="w-[25%] text-center font-semibold text-purple-300">Answer 4</div> -->

				{#each Array(4)
					.fill(0)
					.map((_, i) => i + 1) as answerNumber, i}
					<div class="flex h-full w-[25%] flex-col items-center">
						{votes[i]}
						{#if answers != null}
							<div class="items-center justify-center text-gray-300">
								{answers[i]}
							</div>
						{/if}
					</div>
				{/each}
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

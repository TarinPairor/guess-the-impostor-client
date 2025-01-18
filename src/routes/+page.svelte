<script lang="ts">
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { Spring } from 'svelte/motion';

	let rooms = {
		room1: {
			members: 4,
			room_id: 1
		},
		room2: {
			members: 2,
			room_id: 2
		}
	};

	let open = false;
	let response = 'Nothing yet.';

	const count = new Spring(3);
	$: newMembers = Math.floor(count.current);

	function modulo(n: number, m: number) {
		return ((n % m) + m) % m;
	}

	function handleSubmit() {
		// Navigate to the game page with the room ID
		goto(`/game/1`);
		open = false; // Reset the dialog state after submission
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-16 text-white">
	<section class="mx-auto max-w-6xl">
		<!-- Hero Section -->
		<div class="mb-16 flex flex-col items-center justify-center space-y-8">
			<span class="welcome">
				<picture class="relative block w-full">
					<source srcset={welcome} type="image/webp" />
					<img
						src={welcomeFallback}
						alt="Welcome"
						class="h-auto w-full transform rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-105"
					/>
				</picture>
			</span>

			<h1
				class="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-center text-6xl font-extrabold text-transparent md:text-7xl"
			>
				Guess The Impostor
			</h1>
		</div>

		<!-- Rooms Section -->
		<div class="rounded-xl bg-gray-800 p-8">
			<div class="mb-8 flex flex-col items-center justify-between gap-3">
				<h2 class="text-2xl font-bold text-purple-300">Available Rooms</h2>
				<!-- Moved Button to center of the page -->
				<Button
					on:click={() => (open = true)}
					class="transform rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-pink-600"
				>
					Create Room
				</Button>
			</div>

			<div class="overflow-hidden rounded-xl border border-gray-700">
				<Table.Root>
					<Table.Header>
						<Table.Row class="bg-gray-900/50">
							<Table.Head class="font-semibold text-purple-300">Room ID</Table.Head>
							<Table.Head class="font-semibold text-purple-300">Members</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each Object.values(rooms) as room}
							<Table.Row
								class="cursor-pointer transition-colors duration-200 hover:bg-purple-900/20"
								on:click={() => goto(`/game/${room.room_id}`)}
							>
								<Table.Cell class="font-medium">{room.room_id}</Table.Cell>
								<Table.Cell>{room.members}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</div>
	</section>

	<!-- Create Room Dialog -->
	<Dialog.Root bind:open>
		<Dialog.Content class="bg-gray-900 text-white sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title class="text-2xl font-bold text-purple-300">Create New Room</Dialog.Title>
				<Dialog.Description class="text-gray-400">
					Set number of players for your game room.
				</Dialog.Description>
			</Dialog.Header>

			<div class="grid gap-6 py-6">
				<div class="flex flex-col items-center gap-4">
					<label class="text-gray-300">Number of Players</label>
					<div class="counter">
						<button
							on:click={() => (count.target = Math.max(2, count.target - 1))}
							aria-label="Decrease the counter by one"
							class="text-purple-300 transition-colors hover:text-purple-400"
						>
							<svg aria-hidden="true" viewBox="0 0 1 1" class="h-8 w-8">
								<path d="M0,0.5 L1,0.5" />
							</svg>
						</button>

						<div class="counter-viewport">
							<div
								class="counter-digits"
								style="transform: translate(0, {100 * modulo(count.current, 1)}%)"
							>
								<strong class="hidden" aria-hidden="true">{Math.floor(count.current + 1)}</strong>
								<strong>{Math.floor(count.current)}</strong>
							</div>
						</div>

						<button
							on:click={() => (count.target = Math.min(10, count.target + 1))}
							aria-label="Increase the counter by one"
							class="text-purple-300 transition-colors hover:text-purple-400"
						>
							<svg aria-hidden="true" viewBox="0 0 1 1" class="h-8 w-8">
								<path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" />
							</svg>
						</button>
					</div>
				</div>
			</div>

			<Dialog.Footer>
				<Button
					type="button"
					on:click={handleSubmit}
					class="transform rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-pink-600"
				>
					Create Room
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	{#if response !== 'Nothing yet.'}
		<pre class="mt-4 rounded-lg bg-gray-800 p-4 text-gray-300">{response}</pre>
	{/if}
</main>

<style>
	.counter {
		display: flex;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		margin: 1rem 0;
	}

	.counter button {
		width: 2em;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		background-color: transparent;
		touch-action: manipulation;
		font-size: 2rem;
	}

	svg {
		width: 25%;
		height: 25%;
	}

	path {
		vector-effect: non-scaling-stroke;
		stroke-width: 2px;
		stroke: currentColor;
	}

	.counter-viewport {
		width: 8em;
		height: 4em;
		overflow: hidden;
		text-align: center;
		position: relative;
	}

	.counter-viewport strong {
		position: absolute;
		display: flex;
		width: 100%;
		height: 100%;
		font-weight: 400;
		color: theme('colors.purple.300');
		font-size: 4rem;
		align-items: center;
		justify-content: center;
	}

	.counter-digits {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.hidden {
		top: -100%;
		user-select: none;
	}
</style>

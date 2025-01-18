<script lang="ts">
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Table from '$lib/components/ui/table';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

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
	let newMembers = '';

	function handleSubmit() {
		goto('/game/1');
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
		<div class="rounded-xl bg-gray-800 p-8 shadow-xl">
			<div class="mb-8 flex flex-col items-center justify-between gap-3">
				<h2 class="text-2xl font-bold text-purple-300">Available Rooms</h2>
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
	<Dialog.Root {open} on:close={() => (open = false)}>
		<Dialog.Content class="bg-gray-900 text-white sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title class="text-2xl font-bold text-purple-300">Create New Room</Dialog.Title>
				<Dialog.Description class="text-gray-400">
					Set up your game room parameters below.
				</Dialog.Description>
			</Dialog.Header>

			<div class="grid gap-6 py-6">
				<div class="grid grid-cols-4 items-center gap-4">
					<label for="members" class="text-right text-gray-300">Members</label>
					<input
						id="members"
						bind:value={newMembers}
						class="col-span-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500"
					/>
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
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	/* .welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	} */
</style>

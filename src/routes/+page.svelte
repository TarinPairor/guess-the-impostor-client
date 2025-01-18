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

	function closeHandler(e: CustomEvent<{ action: string }>) {
		switch (e.detail.action) {
			case 'none':
				response = "Ok, well, you're wrong.";
				break;
			case 'all':
				response = 'You are correct. All dogs are the best dog.';
				break;
			default:
				response = "It's a simple question. You should be able to answer it.";
				break;
		}
	}

	function handleSubmit() {
		// Navigate to /game/1
		goto('/game/1');
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcomeFallback} alt="Welcome" />
			</picture>
		</span>
	</h1>
	<p>Here are a list of rooms</p>
	<button on:click={() => (open = true)}>Create</button>
	<Table.Root>
		<Table.Caption>A list of your recent invoices.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="">Room ID</Table.Head>
				<Table.Head>Members</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each Object.values(rooms) as room}
				<Table.Row>
					<Table.Cell>{room.room_id}</Table.Cell>
					<Table.Cell>{room.members}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<Dialog.Root {open} on:close={() => (open = false)}>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Edit Profile</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Edit profile</Dialog.Title>
				<Dialog.Description>
					Make changes to your profile here. Click save when you're done.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<label for="members" class="text-right">Members</label>
					<input id="members" bind:value={newMembers} class="col-span-3" />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="button" on:click={handleSubmit}>Save changes</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
	<pre class="status">Response: {response}</pre>
</section>

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

	.welcome {
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
	}
</style>

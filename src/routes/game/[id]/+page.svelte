<script context="module">
</script>

<script lang="ts">
	import { page } from '$app/state';
	import { writable } from 'svelte/store';

	let inputValue = writable('');
	let formData = writable({});
	let socketMessages = writable<string[]>([]);

	function handleSubmit() {
		inputValue.subscribe((value) => {
			console.log('Input Value:', value);
		});
		inputValue.set('');
	}

	function handleFormSubmit(event: SubmitEvent) {
		event.preventDefault();
		const form = new FormData(event.target as HTMLFormElement);
		const data = Object.fromEntries(form.entries());
		formData.set(data);
		console.log('Form Data:', data);
	}
</script>

<main class="h-screen p-4">
	<div class="flex h-10 w-full flex-row-reverse">
		<button class="ml-2 bg-blue-500 p-2 text-white">Start</button>
	</div>
	<div class="mt-40 h-20 w-full justify-center text-center text-3xl">
		Question: What is the name of the player?
	</div>
	<div class="h-20 w-full text-center text-xl">
		<input type="text" bind:value={$inputValue} class="border p-2" placeholder="Answer" />
		<button on:click={handleSubmit} class="ml-2 bg-blue-500 p-2 text-white">Submit</button>
	</div>
	<div class="absolute inset-x-0 bottom-0 flex h-40 flex-col">
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

<script lang="ts">
	// Link to your YouTube video
	let youtubeVideoURL = 'https://www.youtube.com/embed/T--XBU2SjGY'; // Embed link for proper iframe display
</script>

<svelte:head>
	<title>About | Guess the Impostor</title>
	<meta
		name="description"
		content="Learn how to play Guess the Impostor, the exciting deduction game!"
	/>
</svelte:head>

<main class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-16 text-white">
	<section class="mx-auto max-w-6xl">
		<!-- Hero Section -->
		<div class="mb-16 flex flex-col items-center justify-center space-y-8">
			<h1
				class="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-center text-6xl font-extrabold text-transparent md:text-7xl"
			>
				About the Game
			</h1>
		</div>

		<!-- Explanation Section -->
		<div class="rounded-xl bg-gray-800 p-8">
			<h2 class="mb-4 text-3xl font-bold text-purple-300">How to Play</h2>
			<p class="mb-6 text-lg text-gray-300">
				Welcome to <em>Guess the Impostor</em>, a fast-paced game of deduction and deception! Each
				round, players are assigned one of two roles:
			</p>
			<ul class="list-inside list-decimal text-gray-300">
				<li class="mb-4">
					<strong class="text-purple-300">Normal Player:</strong> You receive a secret word based on
					a chosen topic. Your goal is to describe the word in response to the question asked during
					each round without revealing too much to the impostor.
				</li>
				<li class="mb-4">
					<strong class="text-purple-300">Impostor:</strong> You don't know the word but must try to
					blend in by guessing what the word is based on the other players' descriptions. Be careful
					not to raise suspicion!
				</li>
			</ul>
			<p class="mb-6 text-lg text-gray-300">
				After each round of descriptions, players can vote on who they believe the impostor is. If
				the majority agrees to vote and the impostor is correctly identified, the normal players
				win. But if the vote is wrong—or if the group chooses not to vote—the impostor wins the
				round!
			</p>
			<p class="text-lg text-gray-300">
				Use clever descriptions, sharp intuition, and social strategy to outwit your friends. Can
				you find the impostor, or will they outsmart the group? The game combines elements of
				mystery, collaboration, and bluffing for an exciting experience every time you play!
			</p>
		</div>

		<!-- YouTube Video Section -->
		<div class="mt-12">
			<h2 class="mb-6 text-center text-3xl font-bold text-purple-300">Watch the Gameplay</h2>
			<div class="relative overflow-hidden rounded-xl bg-gray-800 shadow-lg">
				<iframe
					src={youtubeVideoURL}
					title="Guess the Impostor Gameplay"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
					class="h-[350px] w-full md:h-[500px]"
				></iframe>
			</div>
			<div class="mt-4 text-center">
				<a
					href={youtubeVideoURL.replace('embed/', 'watch?v=')}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-block rounded bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-pink-600"
				>
					Watch on YouTube
				</a>
			</div>
		</div>
	</section>
</main>

<style>
	/* ol {
		counter-reset: list-counter;
	} */

	/* ol li {
		margin-left: 1rem;
		position: relative;
		padding-left: 1rem;
	}

	ol li::before {
		counter-increment: list-counter;
		content: counter(list-counter) '.';
		color: #d946ef;
		position: absolute;
		left: 0;
		font-weight: bold;
	} */
</style>

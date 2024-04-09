<script lang="ts">
	import '../app.css';
</script>

<div class="flex flex-col min-h-screen h-screen">
	<header class="flex justify-center items-center bg-white z-10 px-8 py-2">
		<h1 class="text-3xl font-bold">Moverly Event Manager</h1>
	</header>

	<main class="flex h-full overflow-y-scroll bg-right-bottom bg-contain bg-no-repeat bg-fixed }">
		<slot />
	</main>
</div>

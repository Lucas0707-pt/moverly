<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<section class="flex flex-col items-center w-1/2 mx-auto">
	<h1 class="text-3xl font-bold pt-12">Add an event here</h1>
	<h2 class="text-lg pt-6">Please enter your Event information below:</h2>

	{#if form?.success}
		<p class="text-lg font-bold pt-6 self-center">Successfully uploaded the event</p>
	{/if}

	<form method="post" class="form-control pt-12 w-1/2">
		<label for="name" class="label text-lg">Event Name</label>
		<input
			class="input input-bordered"
			value={form?.name ?? ''}
			id="name"
			name="name"
			type="text"
			placeholder="Enter the Event Name here"
		/>

		{#if form?.missing && !form.name}
			<p>The name is required</p>
		{/if}

		<label for="description" class="label text-lg">Event Description</label>
		<textarea
			class="textarea textarea-bordered"
			id="description"
			name="description"
			placeholder="Enter the Event Description here">{form?.description ?? ''}</textarea
		>

		{#if form?.missing && !form.description}
			<p>The description is required</p>
		{/if}

		<label for="price" class="label text-lg">Event Price</label>
		<input
			type="number"
			min="0"
			class="input input-bordered"
			name="price"
			id="price"
			placeholder="Enter the Event Price here"
			value={form?.price ?? ''}
		/>

		{#if form?.missing && !form.price}
			<p>The price is required</p>
		{/if}

		{#if form?.incorrect && form.price}
			<p>Price can't be negative</p>
		{/if}

		<label for="date" class="label text-lg">Event Date</label>
		<input
			type="date"
			value={form?.date ?? ''}
			class="input input-bordered"
			name="date"
			id="date"
		/>

		{#if form?.missing && !form.date}
			<p>The date is required</p>
		{/if}

		{#if form?.incorrect && form.date}
			<p>The chosen date must be after today</p>
		{/if}

		<div class="flex gap-3">
			<div>
				<label for="latitude" class="label text-lg">Event Latitude</label>
				<input
					type="text"
					class="input input-bordered"
					value={form?.coords ?? ''}
					name="latitude"
					id="latitude"
					placeholder="Enter the Latitude here"
				/>
			</div>
			<div class="">
				<label for="longitude" class="label text-lg">Event Longitude</label>
				<input
					type="text"
					class="input input-bordered"
					value={form?.coords ?? ''}
					name="longitude"
					id="longitude"
					placeholder="Enter the Longitude here"
				/>
			</div>
		</div>

		{#if form?.missing && !form.coords}
			<p>The coordinates are required</p>
		{/if}

		<!--
		<label for="images" class="label text-lg">Event Images</label>
		<input
			type="file"
			class="file-input file-input-bordered"
			accept="image/*"
			multiple
			name="files"
			id="images"
		/>
      -->

		<div class="flex justify-center pt-6">
			<button class="btn"> Submit </button>
		</div>
	</form>
</section>

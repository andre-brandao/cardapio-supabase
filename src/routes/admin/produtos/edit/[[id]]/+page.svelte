<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import type { PageData } from './$types';
	import { maskify } from '$lib/mask';
	import { page } from '$app/stores';
	export let data: PageData;

	const { form, errors, constraints, enhance } = superForm(data.form);
	let { supabase } = data;
	$: ({ supabase } = data);

	let imgFILE: any;
	let uploading = false;
	let previewURL: string;

	function removeSpecialCharacters(str: string) {
		return str.replace(/[^\w]/gi, '');
	}

	function generateFileName() {
		const date = new Date();
		const timestamp = date.getTime();
		const random = Math.floor(Math.random() * 1000000);
		const fileName = timestamp + random + '.png';
		return fileName;
	}

	async function uploadFile(e: any) {
		uploading = true;
		const file = e.target.files[0];
		previewURL = URL.createObjectURL(file);

		const fileName = generateFileName();
		//@ts-ignore
		const { data, error } = await supabase.storage.from('produto_imgs').upload(fileName, file, {
			cacheControl: '3600',
			upsert: false
		});
		console.log(data, error);
		//@ts-ignore
		const { data: url } = await supabase.storage.from('produto_imgs').getPublicUrl(fileName);

		$form.image_url = url.publicUrl;
		console.log('upload concluido ' + url.publicUrl);
	}

	async function deleteProduct() {
		const response = await supabase.from('produtos').delete().match({ id: $page.params.id }).single();
		console.log(response);
	}

	// let priceFormated = '0.00';
	// const handleChange = () => {
	// 	console.log('currentInput: ' + $form.preco_in_cents);

	// 	let cleanedInput = $form.preco_in_cents
	// 		.toString()
	// 		.replace(/\D*/gm, '') // remove non digits
	// 		.replace(/^0+/gm, ''); // remove leading zeros
	// 	console.log('cleanedInput.length: ' + cleanedInput.length);

	// 	if (cleanedInput.length === 0) {
	// 		console.log('setting amountFormatted to 0.00 --- BUT IT does not work ');
	// 		priceFormated = '0.00'; // ERROR this never works
	// 	} else {
	// 		priceFormated = (parseInt(cleanedInput, 10) / 100).toString();
	// 	}
	// };
</script>

<main class="flex flex-col items-center">
	<div class="grid grid-cols-4 text-right gap-4 pb-10">
		<!-- <SuperDebug data={$form} /> -->
		<img
			class="object-cover aspect-square"
			width="100"
			height="100"
			src={$form.image_url.length > 0
				? $form.image_url
				: 'https://eftqpoetlueihfnlckbp.supabase.co/storage/v1/object/public/static_images/no_image.jpg'}
			alt="preview"
		/>

		<input
			class="col-span-3 bg-accent flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			id="img"
			name="img"
			type="file"
			accept="image/png, image/jpeg, image/gif"
			on:change={uploadFile}
		/>
	</div>

	<form
		class="flex flex-col gap-5 pb-10 text-lg font-bold"
		action="?/formsubmit"
		method="POST"
		use:enhance
	>
		<input type="hidden" name="image_url" bind:value={$form.image_url} />
		<div class="grid grid-cols-4 text-right gap-4">
			<label class="py-2 text-primary-foreground" for="nome">Nome</label>
			<input
				type="text"
				class="col-span-3 bg-accent flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				id="nome"
				name="nome"
				aria-invalid={$errors.nome ? 'true' : undefined}
				{...$constraints.nome}
				bind:value={$form.nome}
			/>
		</div>
		<div class="grid grid-cols-4 text-right gap-4">
			<label class="py-2 text-primary-foreground" for="descricao">Descrição</label>
			<textarea
				rows="5"
				class="col-span-3 bg-accent flex w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				id="descricao"
				name="descricao"
				aria-invalid={$errors.descricao ? 'true' : undefined}
				{...$constraints.descricao}
				bind:value={$form.descricao}
			/>
		</div>

		<div class="grid grid-cols-4 text-right gap-4">
			<label class="py-2 text-primary-foreground" for="preco_in_cents">Preço em Cents</label>
			<input
				type="number"
				class="col-span-3 bg-accent flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				id="preco_in_cents"
				name="preco_in_cents"
				aria-invalid={$errors.preco_in_cents ? 'true' : undefined}
				{...$constraints.preco_in_cents}
				bind:value={$form.preco_in_cents}
			/>
		</div>
		<div class="grid grid-cols-4 text-right gap-4">
			<label class="py-2 text-primary-foreground" for="categoria">Categoria</label>
			<input
				type="text"
				class="col-span-3 bg-accent flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				id="categoria"
				name="categoria"
				aria-invalid={$errors.categoria ? 'true' : undefined}
				{...$constraints.categoria}
				bind:value={$form.categoria}
			/>
		</div>
		<div class="grid grid-cols-4 text-right gap-4">
			<label class="py-2 text-primary-foreground" for="subcategoria">Sub Categoria</label>
			<input
				type="text"
				class="col-span-3 bg-accent flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				id="sub_categoria"
				name="sub_categoria"
				aria-invalid={$errors.sub_categoria ? 'true' : undefined}
				{...$constraints.sub_categoria}
				bind:value={$form.sub_categoria}
			/>
		</div>
		<div class="flex justify-evenly">
			<div>
				<label class="py-2 text-primary-foreground" for="vegan">Vegano</label>
				<input class="" type="checkbox" id="vegan" name="vegan" bind:checked={$form.vegan} />
			</div>

			<div>
				<label class="py-2 text-primary-foreground" for="visible">Visivel</label>
				<input type="checkbox" id="visible" name="visible" bind:checked={$form.visible} />
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<button
				class="p-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-green-600"
				>Submit</button
			>
			{#if $page.params.id}
				<button
					type="button"
					on:click={deleteProduct}
					class="p-4 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-200 text-secondary-foreground hover:bg-red-500"
					>Delete</button
				>
			{/if}
		</div>
	</form>
</main>

<style>
	/* input {
		display: flex;
		height: 2.5rem;
		width: 100%;
		border-radius: 0.375rem;
		border: 1px solid black;
		background: transparent;
		padding: 0.75rem 0.5rem;
		font-size: 0.875rem;
		outline-offset: 2px;
		transition: background-color 0.15s, border-color 0.15s, box-shadow 0.15s, color 0.15s;
		cursor: not-allowed;
		opacity: 0.5;
	} */
</style>

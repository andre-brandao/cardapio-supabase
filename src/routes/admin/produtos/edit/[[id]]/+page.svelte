<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import type { PageData } from './$types';
	import { maskify } from '$lib/mask';
	import { page } from '$app/stores';
	import { Loader2, PlusCircle, Trash2 } from 'lucide-svelte';
	export let data: PageData;

	const { form, errors, constraints, enhance, delayed, timeout } = superForm(data.form, {
		dataType: 'json',
		delayMs: 500,
		timeoutMs: 10000
	});
	let { supabase } = data;
	$: ({ supabase } = data);

	let imgFILE: any;
	let uploading = false;
	let previewURL: string;

	function removeSpecialCharacters(str: string) {
		return str.replace(/[^\w]/gi, '');
	}

	function generateFileName() {
		if ($form.nome.length > 0) {
			return removeSpecialCharacters($form.nome) + '.png';
		}

		const date = new Date();
		const timestamp = date.getTime();
		const random = Math.floor(Math.random() * 1000000);
		const fileName = timestamp + random + '.png';
		return fileName;
	}

	async function uploadFile(e: any) {
		uploading = true;
		// const file = e.target.files[0];

		const file = await resizeImage(e.target.files[0]);
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

	async function resizeImage(file: File): Promise<File> {
		return new Promise((resolve) => {
			const reader = new FileReader();

			reader.onload = (e) => {
				const img = new Image();
				img.src = e.target?.result as string;

				img.onload = () => {
					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

					// Set the desired square size
					const squareSize = 600;

					let width = img.width;
					let height = img.height;

					let targetWidth, targetHeight;

					// Calculate new dimensions while maintaining aspect ratio
					if (width > height) {
						targetHeight = squareSize;
						targetWidth = (width / height) * squareSize;
					} else {
						targetWidth = squareSize;
						targetHeight = (height / width) * squareSize;
					}

					// Calculate cropping dimensions to maintain aspect ratio
					const cropX = (targetWidth - squareSize) / 2;
					const cropY = (targetHeight - squareSize) / 2;

					// Set canvas dimensions to the final square size
					canvas.width = squareSize;
					canvas.height = squareSize;

					// Crop and draw the image to the center square
					ctx.drawImage(img, -cropX, -cropY, targetWidth, targetHeight);

					// Convert the canvas content to a Blob (resized and cropped image)
					canvas.toBlob((blob) => {
						const resizedFile = new File([blob as Blob], file.name, {
							type: file.type,
							lastModified: Date.now()
						});

						resolve(resizedFile);
					}, file.type);
				};
			};

			reader.readAsDataURL(file);
		});
	}

	async function deleteProduct() {
		const response = await supabase
			.from('produtos')
			.delete()
			.match({ id: $page.params.id })
			.single();
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

	let novoAdicionalNome = '';
	let novoAcionalPreco = 0;
	function adicionarAdicional() {
		let prodID: number | undefined = parseInt($page.params.id);
		if (isNaN(prodID)) {
			prodID = undefined;
		}
		if (novoAdicionalNome.length === 0) {
			return;
		}
		$form.adicional = [
			...$form.adicional,
			{
				nome: novoAdicionalNome,
				preco_in_cents: novoAcionalPreco,
				produto_id: prodID
			}
		];
		// $form.adicional.push({ nome: novoAdicional, preco_in_cents: 0 });
		console.log($form.adicional);

		novoAdicionalNome = '';
		novoAcionalPreco = 0;
	}
	async function deleteAdicional(adicionalID: number) {
		const response = await supabase
			.from('adicional')
			.delete()
			.match({ id: adicionalID })
			.select('*')
			.single();
		console.log(response);
	}
</script>

<main class="flex flex-col items-center">
	<!-- <SuperDebug data={$form} /> -->
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
				placeholder="Nome do Produto"
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
				placeholder="Descrição do Produto"
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
				placeholder="Categoria do Produto"
				aria-invalid={$errors.categoria ? 'true' : undefined}
				{...$constraints.categoria}
				bind:value={$form.categoria}
			/>
		</div>

		<div class="grid grid-cols-4 text-right gap-4">
			<label class="py-2 text-primary-foreground" for="novo-adicional">Adicionais</label>
			<div class="col-span-3 flex flex-row justify-between flex-wrap">
				<input
					type="text"
					class=" bg-accent h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					id="novo-adicional"
					name="novo-adicional"
					placeholder="Nome do Adicional"
					bind:value={novoAdicionalNome}
				/>
				<div class="flex flex-row">
					<div class="text-primary-foreground h-10 py-2 px-2">R$</div>
					<input
						type="number"
						class="col-span-1 bg-accent h-10 w-20 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						id="novo-adicional"
						name="novo-adicional"
						bind:value={novoAcionalPreco}
					/>
				</div>
				<button
					type="button"
					class="bg-green-300 items-center rounded-full p-2"
					on:click={() => {
						adicionarAdicional();
					}}
					><div class="flex">
						<PlusCircle />Add
					</div>
				</button>
			</div>
		</div>
		{#each $form.adicional as _, i}
			<div class="grid grid-cols-4 text-right gap-4">
				<span />
				<div class="col-span-3 flex flex-row justify-between flex-wrap">
					<input
						type="text"
						class=" bg-accent h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						id="novo-adicional"
						name="novo-adicional"
						placeholder="Nome do Novo Adicional"
						data-invalid={$errors.adicional?.[i]?.nome}
						bind:value={$form.adicional[i].nome}
					/>
					<div class="flex flex-row">
						<div class="text-primary-foreground h-10 py-2 px-2">R$</div>
						<input
							type="number"
							class="col-span-1 bg-accent h-10 w-20 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							id="novo-adicional"
							name="novo-adicional"
							data-invalid={$errors.adicional?.[i]?.preco_in_cents}
							bind:value={$form.adicional[i].preco_in_cents}
						/>
					</div>
					<button
						type="button"
						class="bg-red-300 items-center rounded-full p-2"
						on:click={() => {
							let existeID = $form.adicional[i].id;
							if (existeID) {
								deleteAdicional(existeID);
							}
							$form.adicional.splice(i, 1);
							$form.adicional = $form.adicional;
						}}
						><div class="flex">
							<Trash2 />Del
						</div>
					</button>
				</div>
			</div>
		{/each}

		<!-- <div class="grid grid-cols-4 text-right gap-4">
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
		</div> -->
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
				>
				{#if $delayed}
					<Loader2 />
				{:else}
					Salvar Alterações
				{/if}
			</button>
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

<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

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
</script>

<main>
	<SuperDebug data={$form} />
	<form method="POST" use:enhance>
		<img
			src={$form.image_url.length > 0
				? $form.image_url
				: 'https://eftqpoetlueihfnlckbp.supabase.co/storage/v1/object/public/static_images/no_image.jpg'}
			alt="preview"
		/>

		<label for="img" />
		<input
			id="img"
			name="img"
			type="file"
			accept="image/png, image/jpeg, image/gif"
			on:change={uploadFile}
		/>
		<label for="nome">Nome</label>
		<input
			type="text"
			id="nome"
			name="nome"
			aria-invalid={$errors.nome ? 'true' : undefined}
			{...$constraints.nome}
			bind:value={$form.nome}
		/>

		<label for="descricao">descricao</label>
		<input
			type="text"
			id="descricao"
			name="descricao"
			aria-invalid={$errors.descricao ? 'true' : undefined}
			{...$constraints.descricao}
			bind:value={$form.descricao}
		/>

		<label for="preco">preco</label>
		<input
			type="number"
			id="preco"
			name="preco"
			aria-invalid={$errors.preco ? 'true' : undefined}
			{...$constraints.preco}
			bind:value={$form.preco}
		/>

		<label for="categoria">cat</label>
		<input
			type="text"
			id="categoria"
			name="categoria"
			aria-invalid={$errors.categoria ? 'true' : undefined}
			{...$constraints.categoria}
			bind:value={$form.categoria}
		/>

		<label for="subcategoria">sub cat</label>
		<input
			type="text"
			id="sub_categoria"
			name="sub_categoria"
			aria-invalid={$errors.sub_categoria ? 'true' : undefined}
			{...$constraints.sub_categoria}
			bind:value={$form.sub_categoria}
		/>

		<label for="vegan">vegan</label>
		<input type="checkbox" id="vegan" name="vegan" bind:checked={$form.vegan} />

		<label for="visible">visivel</label>
		<input type="checkbox" id="visible" name="visible" bind:checked={$form.visible} />

		<div>
			<button>Submit</button>
		</div>
	</form>
</main>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	img {
		width: 200px;
		height: 200px;
		object-fit: cover;
	}
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

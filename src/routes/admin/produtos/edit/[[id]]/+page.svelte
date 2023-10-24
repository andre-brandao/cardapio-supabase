<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data: PageData;
	const { form, errors, constraints, enhance } = superForm(data.form);
</script>

<main>
	<SuperDebug data={$form} />
	<form method="POST" use:enhance>
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

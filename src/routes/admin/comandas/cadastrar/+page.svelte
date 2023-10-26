<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import type { PageData } from './$types';
	import { maskify } from '$lib/mask';

	export let data: PageData;
	const { form, errors, constraints, enhance } = superForm(data.form);
</script>

<main>
	<SuperDebug data={$form} />
	<form method="POST" use:enhance>
		<label class="text-primary-foreground" for="nome">Nome</label>
		<input
			type="text"
			id="nome"
			name="nome"
			aria-invalid={$errors.nome ? 'true' : undefined}
			{...$constraints.nome}
			bind:value={$form.nome}
		/>

		<label class="text-primary-foreground" for="telefone">Telefone</label>
		<input
			type="text"
			id="telefone"
			name="telefone"
			aria-invalid={$errors.telefone ? 'true' : undefined}
			{...$constraints.telefone}
			bind:value={$form.telefone}
			use:maskify={'(99) 99999-9999'}
		/>

		<label class="text-primary-foreground" for="mesa">quarto</label>
		<select
			name="mesa"
			id="mesa"
			bind:value={$form.mesa}
		>
			<option value="Visitante">Visitante</option>
			<option value="Suite 1">Suite 1</option>
			<option value="Suite 2">Suite 2</option>
			<option value="Suite 3">Suite 3</option>
			<option value="Chale 1">Chale 1</option>
			<option value="Chale 2">Chale 2</option>
			<option value="Chale 3">Chale 3</option>
			<option value="Chale 4">Chale 4</option>
		</select>

		<div>
			<button class="bg-primary">Submit</button>
		</div>
	</form>
</main>

<style>
	form {
		display: flex;
		flex-direction: column;
	}
</style>

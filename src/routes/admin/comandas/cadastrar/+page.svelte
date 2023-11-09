<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import type { PageData } from './$types';
	import { maskify } from '$lib/mask';

	export let data: PageData;
	const { form, errors, constraints, enhance } = superForm(data.form, { taintedMessage: null });
</script>

<main class="flex flex-col items-center">
	<SuperDebug data={$form} />
	<form class="flex flex-col gap-5 pb-10 text-lg font-bold" method="POST" use:enhance>
		<div class="grid grid-cols-4 text-right gap-4">
			<label class="text-primary-foreground py-2" for="nome">Nome</label>
			<input
				class="col-span-3 bg-accent flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				type="text"
				id="nome"
				name="nome"
				aria-invalid={$errors.nome ? 'true' : undefined}
				{...$constraints.nome}
				bind:value={$form.nome}
			/>
		</div>

		<div class="grid grid-cols-4 text-right gap-4">
			<label class="text-primary-foreground py-2" for="telefone">Telefone</label>
			<input
				class="col-span-3 bg-accent flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				type="text"
				id="telefone"
				name="telefone"
				aria-invalid={$errors.telefone ? 'true' : undefined}
				{...$constraints.telefone}
				bind:value={$form.telefone}
				use:maskify={'(99) 99999-9999'}
			/>
		</div>
		<div class="grid grid-cols-4 text-right gap-4">
			<label class="text-primary-foreground py-2" for="mesa">Quarto</label>
			<select
				class="col-span-3 bg-accent flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
		</div>
		<div class="grid grid-cols-1 gap-4">
			<button
				class="p-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-green-600"
				>Submit</button
			>
		</div>
	</form>
</main>

<style>
	form {
		display: flex;
		flex-direction: column;
	}
</style>

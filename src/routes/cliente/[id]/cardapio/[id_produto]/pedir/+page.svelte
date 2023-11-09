<script lang="ts">
	import CardProduto from '$lib/cards/CardProduto.svelte';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import type { PageData } from './$types';
	import { Minus, Plus } from 'lucide-svelte';

	export let data: PageData;

	const produto = data.produto;

	import { superForm } from 'sveltekit-superforms/client';
	import { formatPrice } from '$lib/utils';
	$: console.log(data.produto);

	const { form, errors, constraints, enhance } = superForm(data.form, {
		taintedMessage: null,
		dataType: 'json'
	});
	$form.quantidade = 1;
</script>

<CardProduto {...data.produto} />

<form class="flex flex-col gap-5 px-4 pb-10 text-lg font-bold" method="POST" use:enhance>
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
	<SuperDebug data={$form} />
	<div class="text-center">
		<label class="py-2 text-primary-foreground" for="observacao">Observação</label>
		<textarea
			rows="3"
			class="bg-accent flex w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			id="observacao"
			name="observacao"
			aria-invalid={$errors.observacao ? 'true' : undefined}
			{...$constraints.observacao}
			bind:value={$form.observacao}
		/>
	</div>
	<div class="text-center">
		<label class="py-2 text-primary-foreground" for="quantidade">Quantidade</label>
		<div class="flex flex-row justify-center gap-5">
			<button
				on:click={() => {
					$form.quantidade = $form.quantidade > 1 ? $form.quantidade - 1 : 1;
				}}
				type="button"
				class="p-6 rounded-full text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-100 text-secondary-foreground hover:bg-red-600"
			>
				<Minus />
			</button>
			<!-- class="col-span-3 bg-accent flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" -->
			<input
				type="hidden"
				id="quantidade"
				name="quantidade"
				{...$constraints.quantidade}
				bind:value={$form.quantidade}
			/>
			<div
				class="bg-accent rounded-md border border-input p-5 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{$form.quantidade}
			</div>
			<button
				on:click={() => {
					$form.quantidade = $form.quantidade + 1;
				}}
				type="button"
				class="p-6 rounded-full text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-100 text-secondary-foreground hover:bg-green-600"
			>
				<Plus />
			</button>
		</div>
	</div>
	<div>
		<div class="py-2 text-primary-foreground text-center font-bold">Adicionais</div>
		{#each produto?.adicional ?? [] as adicional}
			<div class="flex flex-row justify-between">
				<label class="py-2 text-primary-foreground" for={'adicional-' + adicional.nome}
					>{adicional.nome}</label
				>
				<div class="flex flex-row">
					<label
						class="py-2 text-primary-foreground mr-2"
						for={'adicional-' + adicional.preco_in_cents}
						>R${formatPrice(adicional.preco_in_cents)}</label
					>
					<input
						class=""
						type="checkbox"
						id={'adicional-' + adicional.nome}
						name={'adicional-' + adicional.nome}
						on:click={(e) => {
							adicional.id;
							if ($form.adicional.includes(adicional.id)) {
								$form.adicional = $form.adicional.filter((id) => id !== adicional.id);
							} else {
								$form.adicional = [...$form.adicional, adicional.id];
							}
						}}
					/>
				</div>
				<!-- bind:checked={$form.vegan} -->
			</div>
			<!-- content here -->
		{/each}
	</div>
	<div class="grid grid-cols-1 gap-4">
		<button
			class="p-4 mb-20 text-lg font-bold inline-flex items-center justify-center rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-green-600"
			>Pedir</button
		>
		<!-- {#if $page.params.id}
			<button
				type="button"
				on:click={deleteProduct}
				class="p-4 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-200 text-secondary-foreground hover:bg-red-500"
				>Delete</button
			>
		{/if} -->
	</div>
	<!-- <button type="submit" class="font-bold bg-black">Enviar</button> -->
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>

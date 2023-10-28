<script lang="ts">
	import CardCliente from '$lib/cards/CardCliente.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let search_bar = '';
	$: clientes = data.clientes.filter((client) => {
		return (
			client.nome.toLowerCase().includes(search_bar.toLowerCase()) ||
			client.mesa.toLowerCase().includes(search_bar.toLowerCase())
		);
	});
</script>

<div class=" px-2 pb-4 pt-5 gap-2 flex flex-row">
	<a class="bg-muted p-2 rounded-sm" href="/admin/comandas/cadastrar">Nova Comanda</a>
	<label class="text-primary-foreground pt-2" for="search">Pesquisar: </label>
	<input
		id="search"
		name="search"
		class="bg-accent h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
		type="text"
		bind:value={search_bar}
	/>
</div>
<div class="px-2 grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
	{#each clientes as cliente (cliente.id)}
		<a href={'/admin/comandas/' + cliente.id}>
			<CardCliente {...cliente} />
		</a>
	{/each}
</div>

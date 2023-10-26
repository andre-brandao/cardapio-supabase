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

<div class="pb-4 pt-5">
	<a class="bg-muted m-3 p-2 rounded-sm" href="/admin/comandas/cadastrar">Nova Comanda</a>
	<input type="text" bind:value={search_bar} />
</div>
<div class="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
	{#each clientes as cliente (cliente.id)}
		<a href={'/admin/comandas/' + cliente.id}>
			<CardCliente {...cliente} />
		</a>
	{/each}
</div>

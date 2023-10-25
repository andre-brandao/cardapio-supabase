<script lang="ts">
	import CardCliente from '$lib/cards/CardCliente.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const clientes = data.clientes;
    
</script>

<a href="/admin/comandas/cadastrar" class="text-white">cadastro</a>
<div class="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
	{#each clientes as cliente}
    {@const date =cliente.created_at}
    
		<CardCliente {...cliente} />
	{/each}
</div>

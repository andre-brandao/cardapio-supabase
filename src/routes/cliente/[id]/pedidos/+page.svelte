<script lang="ts">
	import CardCliente from '$lib/cards/CardCliente.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const pedidos = data.pedidos;
</script>

{#if data.cliente}
	<CardCliente {...data.cliente} />
{/if}

<!-- print pedidos -->
{#each pedidos as pedido}
	<div class="grid grid-cols-2 gap-4">
		<div class="text-white">
			<p>Produto: {pedido.produtos?.nome}</p>
			<p>Quantidade: {pedido.quantidade}</p>
			<p>Valor: {pedido.produtos?.preco_in_cents}</p>
			<p>Observação:{pedido.observacao}</p>
		</div>
		<div class="text-white">
			<p>Cliente:</p>
			<p>Mesa:</p>
			<p>Dia:{new Date(pedido.created_at).toLocaleDateString()}</p>
			<p>Horário: {new Date(pedido.created_at).toLocaleTimeString()}</p>
		</div>
	</div>
{/each}


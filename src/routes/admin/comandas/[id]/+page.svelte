<script lang="ts">
	import CardCliente from '$lib/cards/CardCliente.svelte';
	import { formatPrice } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	const pedidos = data.pedidos;

	function getColor(str: string) {
		if (str === 'Entregue') {
			return 'bg-green-500';
		}
		if (str === 'Em Preparo') {
			return 'bg-yellow-300 ';
		}
		if (str === 'Cancelado') {
			return 'bg-red-400';
		}
		return 'bg-gray-300';
	}
</script>

{#if data.cliente}
	<div class="flex flex-row">
		<a href={`/cliente/${data.cliente.id}/cardapio`}>
			<CardCliente {...data.cliente} />
		</a>
	</div>
{/if}

<main class="mt-5 mb-20">
	<!-- print pedidos -->
	{#each pedidos as pedido}
		<div class={'m-2 rounded-sm p-1 ' + getColor(pedido.status)}>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<p>{pedido.produtos?.nome}</p>
					<p>Quantidade: {pedido.quantidade}</p>
					{#if pedido.produtos}
						<p>Valor: R${formatPrice(pedido.total_in_cents)}</p>
					{/if}
					<p>Dia:{new Date(pedido.created_at).toLocaleDateString()}</p>
					<p>Horário: {new Date(pedido.created_at).toLocaleTimeString()}</p>
				</div>
				<div>
					<p>Status: {pedido.status}</p>
					<p>Observação:{pedido.observacao}</p>
					<p>Adicional:</p>
					{#each pedido.adicional as item}
						<p>{item.nome}</p>
					{/each}
				</div>
			</div>
		</div>
	{/each}
</main>

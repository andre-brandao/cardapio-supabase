<script lang="ts">
	import CardCliente from '$lib/cards/CardCliente.svelte';
	import { formatPrice } from '$lib/utils';
	import { redirect } from '@sveltejs/kit';
	import type { PageData } from './$types';

	export let data: PageData;

	let pedidos = data.pedidos ?? [];

	// sort pedidos by status 1 entregue 2 em preparo 3 cancelado
	$: pedidos = pedidos.sort((a, b) => {
		if (a.status === 'Entregue') {
			return -1;
		}
		if (b.status === 'Entregue') {
			return 1;
		}
		if (a.status === 'Em Preparo') {
			return -1;
		}
		if (b.status === 'Em Preparo') {
			return 1;
		}
		if (a.status === 'Cancelado') {
			return -1;
		}
		if (b.status === 'Cancelado') {
			return 1;
		}
		return 0;
	});

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

	$: idCLiente = data.cliente?.id;

	const checkout = async () => {
		// const resp = await fetch(`/cliente/${idCLiente}/checkout`);
		// const data = await resp.json();
		// console.log(data);

		throw redirect(303, `/cliente/${idCLiente}/checkout`);
	};
</script>

{#if data.cliente}
	<CardCliente {...data.cliente} />
	<a href={`/cliente/${idCLiente}/checkout`}>
		<button
			on:click={() => {
				// checkout();
			}}
			class=" bg-red-400 p-3">checkout</button
		>
	</a>
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
				</div>
			</div>
		</div>
	{/each}
</main>

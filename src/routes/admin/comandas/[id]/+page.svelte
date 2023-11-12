<script lang="ts">
	import { goto } from '$app/navigation';
	import CardCliente from '$lib/cards/CardCliente.svelte';
	import { formatPrice } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	let pedidos = data.pedidos;
	// sort pedidos by status 1 em preparo 2 pendente 3 entregue 4 cancelado
	$: pedidos = pedidos.sort((a, b) => {
		const order = {
			'Em Preparo': 1,
			Pendente: 2,
			Entregue: 3,
			Cancelado: 4
		};
		// @ts-ignore
		return order[a.status] - order[b.status];
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

	let { supabase } = data;
	$: ({ supabase } = data);


	async function cancelarPedido(id: number) {
		const response = await supabase
			.from('pedidos')
			.update({ status: 'Cancelado', updated_by: data.session!.user.id })
			.match({ id });

		console.log(response);

		pedidos.forEach((pedido) => {
			if (pedido.id === id) {
				pedido.status = 'Cancelado';
			}
		});
		pedidos = [...pedidos];
	}

	async function entregarPedido(id: number) {
		const response = await supabase
			.from('pedidos')
			.update({ status: 'Entregue', updated_by: data.session!.user.id })
			.match({ id });

		console.log(response);

		pedidos.forEach((pedido) => {
			if (pedido.id === id) {
				pedido.status = 'Entregue';
			}
		});
		pedidos = [...pedidos];
	}
</script>

{#if data.cliente}
	<div class="flex flex-row">
		<a href={`/cliente/${data.cliente.id}/cardapio`}>
			<CardCliente {...data.cliente} />
		</a>

		<button
			class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
			on:click={()=>{
				let allow = true

				pedidos.forEach((pedido) => {
					if (pedido.status !== 'Entregue' && pedido.status !== 'Cancelado' && pedido.status !== 'Pago com STRIPE') {
						allow = false
					}
				});

				if (!allow) {
					return alert('Ainda existem pedidos em aberto')
				}


				goto(`/admin/comandas/${data.cliente?.id}/checkout`)
			}}
		>
			Checkout
		</button>
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
				<!-- buttom to cancell pedido -->
				{#if pedido.status !== 'Cancelado' && pedido.status !== 'Entregue'}
					<button
						class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
						on:click={() => cancelarPedido(pedido.id)}
					>
						Cancelar
					</button>

					<button
						class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
						on:click={() => entregarPedido(pedido.id)}
					>
						Entregar
					</button>
				{/if}
			</div>
		</div>
	{/each}
</main>

<script lang="ts">
	import { goto } from '$app/navigation';
	import CardCliente from '$lib/cards/CardCliente.svelte';
	import { formatPrice } from '$lib/utils';
	import type { PageData } from './$types';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';

	export let data: PageData;

	let pedidos = data.pedidos;
	let total = data.pedidos.reduce((acc, pedido) => {
		if (pedido.status === 'Cancelado') {
			return acc;
		}
		return acc + pedido.total_in_cents;
	}, 0);
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

	async function redirectCheckout(gorjeta: string) {
		let allow = true;

		if (pedidos.length === 0) {
			console.log('Não existem pedidos, deletando cliente');
			let response = await supabase
				.from('clientes')
				.update({ checkout_date: new Date().toJSON(), checkout_by: data.session!.user.id })
				.eq('id', $page.params.id);
			console.log(response);

			goto('/admin/comandas');
			return;
		}

		pedidos.forEach((pedido) => {
			if (
				pedido.status !== 'Entregue' &&
				pedido.status !== 'Cancelado' &&
				pedido.status !== 'Pago com STRIPE'
			) {
				allow = false;
			} else {
				total += pedido.total_in_cents;
			}
		});

		if (!allow) {
			return alert('Ainda existem pedidos em aberto');
		}

		goto(`/admin/comandas/${data.cliente?.id}/checkout/${gorjeta}`);
	}
	let open = false;

	$: console.log(total);
</script>

{#if data.cliente}
	<div class="flex flex-row justify-between">
		<a class="flex flex-col " target="_blank" href={`/cliente/${data.cliente.id}/cardapio`}>
			<p>Clique aqui para adiconar um pedido</p>
			<CardCliente {...data.cliente} />
		</a>

		<!-- <button
			class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
			on:click={() => {}}
		>
			Checkout
		</button> -->
		<AlertDialog.Root bind:open>
			<AlertDialog.Trigger>
				<Button class="font-bold cursor-pointe space-x-2 bg-green-500  rounded-2xl p-3"
					>Checkout</Button
				>
			</AlertDialog.Trigger>
			<AlertDialog.Content class="text-primary-foreground">
				<AlertDialog.Header>
					<AlertDialog.Title>Pagamento com STRIPE!</AlertDialog.Title>
					<AlertDialog.Description class="text-primary-foreground">
						Quanto deseja adicionar de gorjeta?
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer class="gap-2">
					<AlertDialog.Cancel class="bg-red-300">Cancelar</AlertDialog.Cancel>
					<Button
						class="bg-slate-500 text-black"
						on:click={(e) => {
							redirectCheckout('0');
							open = false;
						}}
					>
						0%
					</Button>
					<Button
						class="bg-slate-500 text-black"
						on:click={(e) => {
							redirectCheckout('10');
							open = false;
						}}
					>
						10% = R${formatPrice(total * 0.1)}
					</Button>

					<Button
						class="bg-slate-500 text-black"
						on:click={(e) => {
							redirectCheckout('20');
							open = false;
						}}
					>
						20% = R${formatPrice(total * 0.2)}
					</Button>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>

		<div class="bg-white p-4 m-2">
			Total: R$ {formatPrice(total)}
		</div>
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

<script lang="ts">
	import CardCliente from '$lib/cards/CardCliente.svelte';
	import { formatPrice } from '$lib/utils';
	import { redirect } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let pedidos = data.pedidos ?? [];

	let total = 0;

	$: total = pedidos.reduce((acc, pedido) => {
		if (pedido.status !== 'Cancelado' && !pedido.status.includes('Pago')) {
			return acc + pedido.total_in_cents;
		}
		return acc;
	}, 0);

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

	const checkout = (gorjeta: string) => {
		// const resp = await fetch(`/cliente/${idCLiente}/checkout`);
		// const data = await resp.json();
		// console.log(data);
		goto(`/cliente/${idCLiente}/checkout/${gorjeta}`);
		//  throw redirect(303, `/cliente/${idCLiente}/checkout/${gorjeta}`);
	};

	let open = false;
</script>

{#if data.cliente}

<div class="flex gap-1 mx-1">
	<CardCliente {...data.cliente} />
	<AlertDialog.Root bind:open>
		<AlertDialog.Trigger>
			<Button class="h-full  font-bold cursor-pointe  bg-green-500  rounded-2xl "
				>Self-Checkout</Button
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
						checkout('0');
					}}
				>
					0%
				</Button>
				<Button
					class="bg-slate-500 text-black"
					on:click={(e) => {
						checkout('10');
					}}
				>
					10% = R${formatPrice(total * 0.1)}
				</Button>

				<Button
					class="bg-slate-500 text-black"
					on:click={async (e) => {
						checkout('20');
					}}
				>
					20% = R${formatPrice(total * 0.2)}
				</Button>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
	
</div>
	<div class="text-center p-3 font-bold mx-5 rounded-lg mt-2 bg-slate-400">
		Total: R$ {formatPrice(total)}
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
				</div>
			</div>
		</div>
	{/each}
</main>

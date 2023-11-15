<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { formatPrice } from '$lib/utils';
	import { page } from '$app/stores';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	export let data: PageData;
	const pedidos = data.pedidos;

	let total = 0;
	let valorGorjeta = 0;
	let produtos: {
		nome: string;
		quantidade: number;
	}[] = [];

	function getTotalProdutos() {
		pedidos?.forEach((pedido) => {
			const index = produtos.findIndex((prod) => prod.nome == pedido.produtos!.nome);

			if (index == -1) {
				produtos.push({
					nome: pedido.produtos!.nome,
					quantidade: pedido.quantidade
				});
				produtos = [...produtos];
			} else {
				produtos[index].quantidade += pedido.quantidade;
				produtos = [...produtos];
			}

			total += pedido.total_in_cents;
		});

		console.log(produtos);
		if ($page.params.gorjeta != '0') {
			valorGorjeta = Math.round((parseInt($page.params.gorjeta) / 100) * total);
		}
		total = total + valorGorjeta;
	}
	let { supabase } = data;
	$: ({ supabase } = data);
	async function checkout() {
		let response1 = await supabase
			.from('clientes')
			.update({ checkout_date: new Date().toJSON(), checkout_by: data.session!.user.id })
			.eq('id', $page.params.id);

		let response2 = await supabase
			.from('pedidos')
			.update({ status: 'Pago no Caixa', updated_by: data.session!.user.id })
			.eq('cliente_id', $page.params.id)
			.eq('pago', '')
			.neq('status', 'Cancelado');



		let response3 = await supabase.from('payment').insert({
			cliente_id: $page.params.id,
			total_in_cents: total ,
			total_gorjeta: valorGorjeta,
			stripe_id: data.session?.user.email
		});

		console.log(response1);
		console.log(response2);
		console.log(response3);

		goto('/admin/comandas');
	}

	let open = false;
	onMount(() => getTotalProdutos());
</script>

<!-- create a table for all produtos -->
<main class="flex flex-col gap-2 mx-5">
	{#each produtos as item}
		<div class="bg-white flex flex-row justify-between rounded-sm p-2">
			<p>Produto: {item.nome}</p>

			<p>Quantidade: {item.quantidade}</p>
		</div>
	{/each}
	<div class="flex flex-col justify-center items-center">
		<h1 class="bg-red-300 text-center px-2 m-2 rounded-sm font-bold">
			Total: R$ {formatPrice(total)}
		</h1>
		<!-- <button
			class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
			on:click={() => {
				checkout();
			}}
		>
			Checkout
		</button> -->

		<AlertDialog.Root bind:open>
			<AlertDialog.Trigger>
				<Button
					class="font-bold cursor-pointer flex items-center space-x-2 bg-green-500  rounded-2xl p-3"
					>Encerrar Comanda Pago no Caixa</Button
				></AlertDialog.Trigger
			>
			<AlertDialog.Content class="text-primary-foreground">
				<AlertDialog.Header>
					<AlertDialog.Title>Essa ação não pode ser desfeita, você tem certeza?</AlertDialog.Title>
					<AlertDialog.Description class="text-primary-foreground">
						This action cannot be undone. This will permanently delete your account and remove your
						data from our servers.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>

					<Button
						class="bg-green-400 text-black"
						on:click={(e) => {
							checkout();
							open = false;
						}}
					>
						Continuar
					</Button>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</div>
</main>

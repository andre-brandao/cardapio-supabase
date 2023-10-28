<script lang="ts">
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import CardPedido from '$lib/cards/CardPedido.svelte';
	import { formatPrice } from '$lib/utils';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let pedidos = data.pedidos;
	let { supabase, session } = data;
	$: ({ supabase } = data);

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

	let realtimePedidos: RealtimeChannel;

	onMount(async () => {
		realtimePedidos = supabase
			.channel('pedidos')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, async () => {
				const { data: pedidoSUb, error } = await supabase
					.from('pedidos')
					.select('*, produtos (*), clientes(*)')
					.order('created_at', { ascending: false });
				// .neq('status', 'Entregue');
				pedidos = pedidoSUb ?? [];
			})
			.subscribe();

	});

	onDestroy(() => {
		realtimePedidos?.unsubscribe();
	});
</script>

<main class="mt-5 mb-20">
	<!-- print pedidos -->
	{#each pedidos as pedido}
		<div class="grid grid-cols-2 gap-4">
			<CardPedido {...pedido} {supabase} {session} />
		</div>
	{/each}
</main>

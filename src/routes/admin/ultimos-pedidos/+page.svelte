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
					.select('*, produtos (*), clientes(*), adicional(*)')
					.neq('status', 'Entregue')
					.order('created_at', { ascending: false });
				// .neq('status', 'Entregue');
				pedidos = pedidoSUb ?? [];
			})
			.subscribe();
			
	});
	// log all pedidos that contain a adicional
	$: console.log(pedidos.filter((pedido) => pedido.adicional));

	onDestroy(() => {
		realtimePedidos?.unsubscribe();
	});
</script>

<main class="">
	<!-- print pedidos -->
	<div class="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4">
		{#each pedidos as pedido}
			<CardPedido {...pedido} {supabase} {session} />
		{/each}
	</div>
</main>

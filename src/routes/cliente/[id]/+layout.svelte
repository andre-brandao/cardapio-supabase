<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import Transition from '$lib/components/Transition.svelte';
	import { ClipboardSignature, Utensils } from 'lucide-svelte';

	export let data: LayoutData;

	let cliente = data.cliente;
</script>

<!-- <h1 class="text-whtie bg-red-600">OLA {data.cliente?.nome}</h1> -->

{#if cliente?.checkout_date == null}
	<!-- content here -->
	<Transition>
		<slot />
	</Transition>
	<nav
		class="fixed bottom-0 left-0 right-0 bg-muted flex justify-around items-center h-16 shadow-md z-10"
	>
		<a
			class="flex gap-2 {$page.route.id === '/cliente/[id]/cardapio'
				? 'bg-background text-white font-bold'
				: 'text-background font-bold'} p-2 rounded-sm"
			href="/cliente/{data.cliente?.id}/cardapio"
		>
			<Utensils />
			Cardapio
		</a>
		<a
			class="flex gap-2 {$page.route.id === '/cliente/[id]/pedidos'
				? 'bg-background text-white  font-bold'
				: ' text-background font-bold'} p-2 rounded-sm"
			href="/cliente/{data.cliente?.id}/pedidos"
		>
			<ClipboardSignature />
			Pedidos
		</a>
	</nav>
{:else}
	<div class="text-center text-primary-foreground">
		<p>Obrigado por se hospedar conosco!</p>
		<p>Volte Sempre!!</p>
	</div>
{/if}

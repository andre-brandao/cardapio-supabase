<script lang="ts">
	import type { LayoutData } from './$types';
    import { page } from '$app/stores';

	export let data: LayoutData;
</script>

<h1 class="text-whtie bg-red-600">OLA {data.cliente?.nome}</h1>

<slot />

<nav
	class="fixed bottom-0 left-0 right-0 bg-muted flex justify-around items-center h-16 shadow-md z-10"
>
	<a
		class="{$page.route.id === '/cliente/[id]/pedidos'
			? 'bg-background text-white  font-bold'
			: ' text-background font-bold'} p-2 rounded-sm"
		href="/cliente/{data.cliente?.id}/pedidos"
	>
		Pedidos
	</a>

	<a
		class="{$page.route.id === '/cliente/[id]/cardapio'
			? 'bg-background text-white font-bold'
			: 'text-background font-bold'} p-2 rounded-sm"
		href="/cliente/{data.cliente?.id}/cardapio"
	>
		Cardapio
	</a>
</nav>

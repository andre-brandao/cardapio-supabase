<script lang="ts">
	import type { LayoutData } from './$types';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Login from '$lib/Login.svelte';
	import { page } from '$app/stores';

	export let data: LayoutData;
	//   export let data

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

{#if data.session}
	<nav class="bg-muted rounded-sm m-3 p-2 flex items-center overflow-auto space-x-4 lg:space-x-6">
		<a
			href="/admin/comandas"
			class="{$page.route.id == '/admin/comandas'
				? 'bg-background text-white p-1'
				: 'text-muted-foreground'} rounded-sm px-1 font-bold transition-colors hover:text-primary"
		>
			Comandas
		</a>
		<a
			href="/admin/produtos"
			class="{$page.route.id == '/admin/produtos'
				? 'bg-background text-white p-1'
				: 'text-muted-foreground'} rounded-sm px-1 font-bold transition-colors hover:text-primary"
		>
			Produtos
		</a>

		<a href="/cliente/mesa/QGRo1" class="text-white">quarto 1</a>
		<p class="text-white">Bem vindo {data.session.user.email}</p>
	</nav>
	<!-- content here -->
	<slot />
{:else}
	<div class="flex justify-center items-center h-screen">
		<Login {supabase} />
	</div>
{/if}

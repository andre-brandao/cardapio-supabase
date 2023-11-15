<script lang="ts">
	import type { LayoutData } from './$types';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Login from '$lib/components/Login.svelte';
	import { page } from '$app/stores';
	import Transition from '$lib/components/Transition.svelte';

	export let data: LayoutData;
	//   export let data

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	$: console.log(data.admin_permitions);

	onMount(() => {
		// const {
		// 	data: { subscription }
		// } = 


		supabase.auth.onAuthStateChange((event, _session) => {

			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}

			if (event === 'SIGNED_OUT') {
				// delete cookies on sign out
				const expires = new Date(0).toUTCString();
				document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
				document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
			} else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
				const maxAge = 100 * 365 * 24 * 60 * 60; // 100 years, never expires
				document.cookie = `my-access-token=${
					_session!.access_token
				}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
				document.cookie = `my-refresh-token=${
					_session!.refresh_token
				}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
			}
		});

		// return () => subscription.unsubscribe();
	});

	async function handleSignOut() {
		const resp = await supabase.auth.signOut();

		location.reload();

		const expires = new Date(0).toUTCString();
		document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
		document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
		console.log(resp);
	}
</script>

<div class="flex justify-between">
	<img
		class="p-2 w-64 h-auto rounded-lg filter invert"
		src="https://firebasestorage.googleapis.com/v0/b/svelte-cardapio.appspot.com/o/static%2Flogo-h-p.png?alt=media&token=a129a507-20ad-4b9e-887f-d7da1e831155"
		alt=""
	/>

	<div class="flex justify-center items-center flex-wrap">
		<div class="">
			{#if data.session}
				<p class="text-white text-center mx-2 overflow-hidden flex-wrap">
					Bem vindo! {data.session.user.email?.split('@')[0]}
				</p>
			{/if}
		</div>
		{#if data.session}
			<button
				class="bg-primary text-white rounded-sm px-2 mx-2 py-1 font-bold transition-colors hover:bg-red-400"
				on:click={() => handleSignOut()}
			>
				Sair
			</button>
		{/if}
	</div>
</div>

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
		<a
			href="/admin/ultimos-pedidos"
			class="{$page.route.id == '/admin/ultimos-pedidos'
				? 'bg-background text-white p-1'
				: 'text-muted-foreground'} rounded-sm px-1 font-bold transition-colors hover:text-primary"
		>
			Ultimos Pedidos
		</a>
	</nav>
	<!-- content here -->
	<Transition>
		<slot />
	</Transition>
{:else}
	<div class="flex justify-center items-center h-screen">
		<Login {supabase} />
	</div>
{/if}

<script lang="ts">
	import type { LayoutData } from './$types';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

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
	<a href="/admin/comandas" class="text-white">comandas</a>
	<a href="/admin/produtos" class="text-white">produtos</a>
	<a href="/cliente/mesa/QGRo1" class="text-white">quarto 1</a>

	<a href="/admin/produtos" class="text-white">
		<p>Bem vindo {data.session.user.email}</p>
	</a>
	<!-- content here -->
{:else}
	<p>Por favor, faça login</p>
{/if}
<slot />

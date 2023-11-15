<!-- // src/routes/auth/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { redirect } from '@sveltejs/kit';
	// import {supabase} from 	'$'

	export let supabase: SupabaseClient;

	// import type { LayoutData } from ''
	// export let data;
	// let { supabase } = data;
	// $: ({ supabase } = data);

	let email: string;

	let password: string;

	const handleSignUp = async () => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password

			// options: {
			// 	emailRedirectTo: `${location.origin}/auth/callback`
			// }
		});

		console.log(data, error);
		// throw redirect(303, '/admin/produtos');
	};

	const handleSignIn = async () => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		console.log(data, error);
		location.reload();

		// throw redirect(303, '/admin/produtos');
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
	};

	const loginGoogle = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: 'http://www.cafedavillla.com/auth/callback'
			}
		});
	};
</script>

<main class="text-foreground bg-card p-3 rounded-sm">
	<h1 class="text-black">Login admin</h1>
	<!-- <label class="text-black" for="email">Email</label>
	<input name="email" bind:value={email} />
	<label class="text-black" for="password">Senha</label>
	<input type="password" name="password" bind:value={password} />

	<button class="bg-green-300" on:click={handleSignIn}>Log in</button>

	<button class="bg-red-300" on:click={handleSignUp}>Sign up</button> -->

	<!-- google login -->
	<button class="bg-blue-300" on:click={loginGoogle}>Login with Google</button>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>

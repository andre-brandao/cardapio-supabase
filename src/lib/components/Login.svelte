<!-- // src/routes/auth/+page.svelte -->
<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { redirect } from '@sveltejs/kit';


    export let supabase:SupabaseClient
	// export let data;
	// let { supabase } = data;
	// $: ({ supabase } = data);


	let email:string

	let password:string

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
		// throw redirect(303, '/admin/produtos');
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
	};
</script>

<main class="text-foreground bg-card p-3 rounded-sm">

    <h1 class="text-black">Login admin</h1>
	<!-- <form on:submit={handleSignUp}> -->
	<label class="text-black" for="email">Email</label>
	<input name="email" bind:value={email} />
	<label class="text-black" for="password">Senha</label>
	<input type="password" name="password" bind:value={password} />
	<!-- <button class="bg-red-300" on:click={handleSignUp}>Sign up</button> -->
	<!-- </form> -->

	<button class="bg-green-300" on:click={handleSignIn}>Log in</button>
	<!-- <button class="bg-red-300" on:click={handleSignOut}>Log out</button> -->
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>

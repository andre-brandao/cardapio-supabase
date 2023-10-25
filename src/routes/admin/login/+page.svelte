<!-- // src/routes/auth/+page.svelte -->
<script>
	import { redirect } from '@sveltejs/kit';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	/**
	 * @type {string}
	 */
	let email;
	/**
	 * @type {string}
	 */
	let password;

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
<main class="text-whit">


	<!-- <form on:submit={handleSignUp}> -->
		<input name="email" bind:value={email} />
		<input type="password" name="password" bind:value={password} />
		<button class="bg-red-300" on:click={handleSignUp}>Sign up</button>
		<!-- </form> -->
		
		<button class="bg-red-300" on:click={handleSignIn}>Sign in</button>
		<button class="bg-red-300" on:click={handleSignOut}>Sign out</button>
		
	</main>
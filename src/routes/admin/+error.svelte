<script lang="ts">
	import { page } from '$app/stores';
</script>

<main class="text-white text-center bg-red-300">
	<h1>{$page.status}: {$page.error?.message}</h1>

	<h1>Not an autorized admin</h1>
</main>

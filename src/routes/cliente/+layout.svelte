<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>


<main>
	<img
	class="p-2 w-64 h-auto rounded-lg filter invert"
	src="https://firebasestorage.googleapis.com/v0/b/svelte-cardapio.appspot.com/o/static%2Flogo-h-p.png?alt=media&token=a129a507-20ad-4b9e-887f-d7da1e831155"
	alt=""
/>

	<slot></slot>
</main>
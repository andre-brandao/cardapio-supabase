<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const produtos = data.produtos;
</script>
<main>
    <a href="/admin/produtos/edit">NOVO produto</a>
    {#each produtos as item (item.id)}
        <!-- <p>{item.nome}</p> -->
        <a href="/admin/produtos/edit/${item.id}">{item.nome}</a>
    {/each}

</main>

<style>
    main{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
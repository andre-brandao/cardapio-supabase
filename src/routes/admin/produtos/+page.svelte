<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';

	import CardProduto from '$lib/cards/CardProduto.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: produtos = data.produtos.filter((prod) => {
		return (
			prod.nome.toLowerCase().includes(search_bar.toLowerCase()) ||
			prod.descricao?.toLowerCase().includes(search_bar.toLowerCase()) ||
			prod.categoria.toLowerCase().includes(search_bar.toLowerCase())
		);
	});

	let search_bar = '';

	$: categorias = [...new Set(produtos.map((prod) => prod.categoria))];

	function produtosFrom(categoria: string) {
		return produtos
			.filter((prod) => prod.categoria == categoria && prod.visible)
			.sort((a, b) => {
				if (a.nome < b.nome) {
					return -1;
				}
				if (a.nome > b.nome) {
					return 1;
				}

				return 0;
			});
	}

	// import prodJSON from '$lib/produtos.json';
	// let { supabase } = data;
	// $: ({ supabase } = data);
	// async function insertProdutos() {
	// 	for (const produto of prodJSON) {
	// 		// console.log(produto);

	// 		//ts-ignore
	// 		// const preco = parseFloat(produto.preco) * 100;
	// 		console.log(produto);

	// 		await supabase.from('produtos').insert({
	// 			categoria: produto.categoria,

	// 			descricao: produto.descricao,

	// 			image_url: produto.url,
	// 			nome: produto.nome,
	// 			preco_in_cents: parseFloat(produto.preco) * 100,
	// 			sub_categoria: produto.subcategoria,
	// 			vegan: produto.vegano,
	// 			visible: produto.visivel
	// 		});
	// 	}
	// }
</script>

<!-- <button on:click={insertProdutos} class="p-5 bg-red-500">INSERT</button> -->
<main class="flex flex-col">
	<div class=" px-2 pb-4 pt-5 gap-2 flex flex-row">
		<a class="bg-muted p-2 rounded-sm" href="/admin/produtos/edit">Cadastrar Produto</a>
		<label class="text-primary-foreground pt-2" for="search">Pesquisar: </label>
		<input
			id="search"
			name="search"
			class="bg-accent h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			type="text"
			bind:value={search_bar}
		/>
	</div>
	<Tabs.Root value={categorias[0]}>
		<div class="sticky top-0 z-10 p-2 bg-background">
			<Tabs.List class="flex overflow-y-scroll">
				{#each categorias as categoria}
					<Tabs.Trigger class="font-bold data-[state=active]:text-white" value={categoria}
						>{categoria}</Tabs.Trigger
					>
				{/each}
			</Tabs.List>
		</div>

		{#each categorias as categoria}
			<Tabs.Content value={categoria}>
				<div class="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
					{#each produtosFrom(categoria) as produto (produto.id)}
						<a href="/admin/produtos/edit/{produto.id}">
							<CardProduto {...produto} />
						</a>
					{/each}
				</div>
			</Tabs.Content>
		{/each}
		<!--{#each produtos as item (item.id)}
			<a href="/admin/produtos/edit/${item.id}">
				<CardProduto produto={item} />
			</a> -->
		<!-- {/each} -->
	</Tabs.Root>
</main>

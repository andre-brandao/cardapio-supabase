<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';

	import CardProduto from '$lib/cards/CardProduto.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: produtos = data.produtos.filter((prod) => {

		return (
			prod.nome.toLowerCase().includes(barra_pesquisa.toLowerCase()) ||
			prod.descricao?.toLowerCase().includes(barra_pesquisa.toLowerCase()) ||
			prod.categoria.toLowerCase().includes(barra_pesquisa.toLowerCase())
		);

	});

	let barra_pesquisa = '';

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
</script>

<main class="flex flex-col">
	<div class="pb-4 pt-5">
		<a class="bg-muted m-3 p-2 rounded-sm" href="/admin/produtos/edit">NOVO produto</a>
		<input type="text" bind:value={barra_pesquisa}>
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

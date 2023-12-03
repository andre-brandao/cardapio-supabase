<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';

	import CardProduto from '$lib/cards/CardProduto.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { category_order } from '$lib/utils';

	export let data: PageData;
	const produtos = data.produtos ?? [];
	
	$: categorias = [...new Set(produtos.map((prod) => prod.categoria))]
		.sort((a, b) => {
			const indexA = category_order.indexOf(a);
			const indexB = category_order.indexOf(b);
			if (indexA === -1 && indexB === -1) {
				return a.localeCompare(b);
			} else if (indexA === -1) {
				return 1;
			} else if (indexB === -1) {
				return -1;
			} else {
				return indexA - indexB;
			}
	
	
	});

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
	//create a function to remove white spaces and replace with hyphens
	function removeSpaces(string: string) {
		return string.split(' ').join('-');
	}

	function scrollIntoView(categoria: string) {
		const el = document.querySelector('#' + removeSpaces(categoria));
		if (!el) return;
		el.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
			inline: 'nearest'
		});
		// window.scrollBy(0, -20);
	}
	$: cat_selecionada = categorias[0];
</script>

<main class="flex flex-col">
	<img
	class="p-2 w-64 h-auto rounded-lg filter invert"
	src="https://firebasestorage.googleapis.com/v0/b/svelte-cardapio.appspot.com/o/static%2Flogo-h-p.png?alt=media&token=a129a507-20ad-4b9e-887f-d7da1e831155"
	alt=""
/>

	<Tabs.Root value={cat_selecionada}>
		<div class="sticky top-0 z-10 p-2 bg-background">
			<Tabs.List class="flex overflow-y-scroll">
				{#each categorias as categoria}
					<!-- <a href={`#${categoria}`} on:click|preventDefault={scrollIntoView}> -->
					<Tabs.Trigger
						on:click={() => {
							scrollIntoView(categoria);
							console.log(categoria);
							cat_selecionada = categoria;
						}}
						class="font-bold data-[state=active]:text-white"
						value={categoria}>{categoria}</Tabs.Trigger
					>
					<!-- </a> -->
				{/each}
			</Tabs.List>
		</div>

		{#each categorias as categoria}
			<!-- <Tabs.Content value={categoria}> -->
			<div
				on:focus={() => {
					cat_selecionada = categoria;
				}}
				id={removeSpaces(categoria)}
				class="mx-5 my-5 p-2 text-center rounded-sm text-card-foreground font-bold text-[25px] shadow-sm bg-opacity-50 bg-muted"
			>
				{categoria}
			</div>

			<div class="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
				{#each produtosFrom(categoria) as produto (produto.id)}
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						
					>
						<CardProduto {...produto} />
					</div>
					<!-- <a href={$page.url + '/' + produto.id + '/pedir'}>
					</a> -->
				{/each}
			</div>

			<!-- </Tabs.Content> -->
		{/each}
		<!--{#each produtos as item (item.id)}
			<a href="/admin/produtos/edit/${item.id}">
				<CardProduto produto={item} />
			</a> -->
		<!-- {/each} -->
	</Tabs.Root>
</main>

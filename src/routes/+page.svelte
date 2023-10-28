<!-- <script lang="ts">
	import produtos from '$lib/produtos.json';
	import { supabase } from '$lib/supabase';
	function insertProdutos() {
		for (const produto of produtos) {
			// console.log(produto);

			//ts-ignore
			// const preco = parseFloat(produto.preco) * 100;
            console.log(produto);
            
			supabase
				.from('produtos')
				.insert({
					categoria: produto.categoria,

					descricao: produto.descricao,

					image_url: produto.url,
					nome: produto.nome,
					preco_in_cents: parseFloat(produto.preco) * 100,
					sub_categoria: produto.subcategoria,
					vegan: produto.vegano,
					visible: produto.visivel
				})
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button class="bg-red-500 p-10" on:click={insertProdutos} /> -->

<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	import type { PageData } from './$types';

	export let data: PageData;

	const clientes = data.clientes;
</script>

<Card.Root class="m-4">
	<Card.Header class="text-center">
		<Card.Title>{data.mesa}</Card.Title>
	</Card.Header>
</Card.Root>
<a href={`/cardapio`}>
	<Card.Root class="m-4 bg-green-800 text-white">
		<Card.Header class="text-center">
			<Card.Title>Cardapio</Card.Title>
		</Card.Header>
	</Card.Root>
</a>

<div class="text-center font-bold text-white">Faça seu Pedido em sua comanda:</div>
{#each clientes as cliente}
	<a href={`/cliente/${cliente.id}/cardapio`}>
		<Card.Root class="m-2">
			<Card.Header class="text-center">
				<Card.Title>{cliente.nome}</Card.Title>
				<!-- <Card.Description>{cliente.waitress}</Card.Description> -->
			</Card.Header>
		</Card.Root>
	</a>
{/each}

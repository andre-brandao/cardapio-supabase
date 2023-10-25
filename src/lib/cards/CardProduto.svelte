<script>
	import * as Card from '$lib/components/ui/card';

	//     export const produtoSchema = z.object({
	// 	nome: z.string().min(3).max(25),
	// 	descricao: z.string(),
	// 	categoria: z.string(),
	// 	sub_categoria: z.string(),

	// 	preco: z.number(),
	// 	image_url: z.string(),
	// 	vegan: z.boolean(),
	// 	visible: z.boolean()
	// });

	export let produto = {
		nome: 'Produto',
		descricao: 'Descrição do produto',
		categoria: 'Categoria',
		sub_categoria: 'Subcategoria',

		preco: 420.69,
		image_url: '',
		vegan: false,
		visible: false
	};
</script>

<Card.Root class="flex cursor-pointer hover:shadow-lg m-2">
	<img
		class="w-1/2 aspect-square object-cover rounded-l-lg"
		src={produto.image_url.length > 0
			? produto.image_url
			: 'https://firebasestorage.googleapis.com/v0/b/svelte-cardapio.appspot.com/o/static%2Fno_image.jpg?alt=media&token=cf56867b-39f9-4419-9d6c-aa94d7ce640a'}
		alt=""
	/>
	<div class="w-1/2 flex flex-col">
		<Card.Header class="flex-shrink-0 p-3">
			<Card.Title class="font-bold mb-2 mt-3">{produto.nome}</Card.Title>
			<Card.Description
				class="overflow-hidden line-clamp-3 text-justify font-normal text-card-foreground"
				>{produto.descricao}</Card.Description
			>
		</Card.Header>
		<!-- <Card.Content>
            <p>Card Content</p>
        </Card.Content> -->
		<Card.Footer class="flex-grow justify-end align-text-bottom m-0 p-0 pr-3 font-medium">
			R${produto.preco}
		</Card.Footer>
	</div>
</Card.Root>

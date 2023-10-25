<script lang="ts">
    import * as Card from '$lib/components/ui/card';

    export let nome:string
    export let telefone:string
    export let mesa:string
    export let created_at

    let date = new Date(created_at).toLocaleString('pt-BR')
</script>

<Card.Root>


	<Card.Header>
		<div class="mb-5 text-center text-lg font-bold bg-white rounded-sm">
			{nome}
			{mesa}
		</div>
		<Card.Title>
			<div class="flex justify-around">
				<div>
					{telefone}
				</div>
				
			</div>
		</Card.Title>
		<!-- <div class="flex justify-around">
			{id}
		</div> -->

        <Card.Footer class="justify-around">
            <p>Cadastrado: {date}</p>
        </Card.Footer>
	</Card.Header>





</Card.Root>
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { Session } from '@supabase/supabase-js';

    export let session: Session

	export let  supabase :any;

	export let id: number;
	export let status: string;
	export let created_at: string;
	export let updated_by: string | null;
    export let total_in_cents: number;
    export let quantidade: number;
    export let observacao: string;

	export let produtos: {
		id: number;
		nome: string;
		descricao: string;
		preco_in_cents: number;
		created_at: string;
		updated_at: string;
	};
	export let clientes: {
		id: number;
		nome: string;
mesa: string;
        telefone: string;
		created_at: string;
	};
	async function updateStatus(status: string, id: number) {
        console.log(id);
        
		const response = await supabase.from('pedidos').update({ status , updated_by: session.user.id}).match({ id });

		console.log(response);
	}
</script>

<Card.Root
	class="{status === 'Entregue'
		? 'bg-green-400'
		: status === 'Em Preparo'
		? 'bg-yellow-300'
		: status === 'Cancelado'
		? 'bg-red-400'
		: 'bg-gray-400'} m-3 transition-all duration-500 delay-100"
>
	<Card.Header>
		<div class="mb-5 text-center text-lg font-bold bg-white rounded-sm">
			{clientes.nome}
			{clientes.mesa}
		</div>
		<Card.Title>
			<div class="flex justify-around">
				<div>
					{produtos.nome}
                    Quantidade: {quantidade}
				</div>
			</div>
		</Card.Title>
		<div>
			ID: {id}
		</div>
		<Card.Description>
			<div>
				<p>
					OBS: {observacao}
				</p>
				<!-- {#if entregador}
                    {/if} -->
					<p>
						id:{id}
					</p>
					<p>
						alterado:{updated_by}
					</p>
			</div>
		</Card.Description>
	</Card.Header>
	<div class="mb-5 text-center text-lg font-bold rounded-sm">
		{status}
	</div>
	<Card.Content>
		<div class="flex justify-evenly">
			<AlertDialog.Root>
				<AlertDialog.Trigger>
					<Button
						class="font-bold cursor-pointer flex items-center space-x-2 bg-green-500  rounded-2xl p-3"
						>Entregue</Button
					></AlertDialog.Trigger
				>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Essa ação não pode ser desfeita, você tem certeza?</AlertDialog.Title
						>
						<AlertDialog.Description>
							This action cannot be undone. This will permanently delete your account and remove
							your data from our servers.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
						<Button
							on:click={() => {
								console.log('click');

								updateStatus('Entregue', id);
							}}
						>
							Continuar
						</Button>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>

			<Button
				class="font-bold  cursor-pointer flex items-center space-x-2 bg-yellow-500 rounded-2xl p-3"
				on:click={() => {
					updateStatus('Em Preparo', id);
				}}>Preparando</Button
			>

			<Button
				class="font-bold  cursor-pointer flex items-center space-x-2 bg-red-500 rounded-2xl p-3"
				on:click={() => {
					updateStatus('Cancelado', id);
				}}>Cancelado</Button
			>
		</div>
	</Card.Content>
	<Card.Footer class="justify-around">
		<p>{created_at}</p>
	</Card.Footer>
</Card.Root>

<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	import { superForm } from 'sveltekit-superforms/client';

	const { form, errors, constraints, enhance } = superForm(data.form);
</script>

<form  method="POST"  use:enhance>
	<label class="text-primary-foreground" for="observacao">Observação</label>
	<input
		type="text"
		id="observacao"
		name="observacao"
		aria-invalid={$errors.observacao ? 'true' : undefined}
		{...$constraints.observacao}
		bind:value={$form.observacao}
	/>

	<label class="text-primary-foreground" for="quantidade">Quantidade</label>
	<input
		type="number"
		id="quantidade"
		name="quantidade"
		aria-invalid={$errors.quantidade ? 'true' : undefined}
		{...$constraints.quantidade}
		bind:value={$form.quantidade}
	/>

	<button type="submit" class="font-bold bg-black">Enviar</button>
</form>


<style>
    form{
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

</style>

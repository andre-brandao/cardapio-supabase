import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { pedidoSchema } from '$lib/schemas';

export const load = (async (event) => {
	const form = await superValidate(event, pedidoSchema);
	const { data, error } = await event.locals.supabase
		.from('produtos')
		.select('*, adicional(*)')
		.eq('id', event.params.id_produto)
		.single();
	if (error) {
		console.log(error);
	}
	return { form, produto: data };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const supabase = event.locals.supabase;
		const clienteID = event.params.id;
		const pordutoID = parseInt(event.params.id_produto);

		const form = await superValidate(event, pedidoSchema);

		console.log(form.data);

		if (!form.valid) {
			console.log('invalid form');

			return fail(400, {
				form
			});
		}

		const novoPedido = {
			produto: pordutoID,
			cliente_id: clienteID,
			quantidade: form.data.quantidade,
			observacao: form.data.observacao
		};

		const adicional = form.data.adicional;
		console.log(adicional);

		const { data: pedido, error } = await supabase
			.from('pedidos')
			.insert(novoPedido)
			.select('*')
			.single();
		console.log(pedido?.id);

		// create new pedido_adicional
		if (pedido?.id) {
			const response = await supabase.from('pedido_adicional').insert(
				adicional.map((adicional_id: number) => {
					return {
						adicional_id,
						pedido_id: pedido.id
					};
				})
			);
			console.log(response);
		}
		console.log(pedido);

		if (error) {
			// return fail(500, {
			// 	error
			// });
			console.log(error);
		} else {
			throw redirect(303, `/cliente/${clienteID}/cardapio`);
		}

		return { form };
	}
};

import { z } from 'zod';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';

const pedidoSchema = z.object({
	observacao: z.string().optional(),
	quantidade: z.number().min(1)
});
export const load = (async (event) => {
	const form = await superValidate(event, pedidoSchema);
	return { form };
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

		const data = {
			...form.data,
			produto: pordutoID,
			cliente_id: clienteID
		};

		const { data: pedido, error } = await supabase.from('pedidos').insert(data).select();

		console.log(pedido);

		if (error) {
			// return fail(500, {
			// 	error
			// });
			console.log(error);
		}

		return { form };
	}
};

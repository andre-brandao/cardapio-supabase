import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { clienteSchema } from '$lib/schemas';
import { fail } from '@sveltejs/kit';
export const load = (async (event) => {
	const form = await superValidate(event, clienteSchema);
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const supabase = event.locals.supabase;

		const form = await superValidate(event, clienteSchema);

		console.log(form.data);

		if (!form.valid) {
			console.log(form);

			return fail(400, {
				form
			});
		}

		const { data, error } = await supabase.from('clientes').insert(form.data).select();

		console.log('created new cliente');
		console.log(data);

		if (error) {
			// return fail(500, {
			// 	error
			// });
			console.log(error);
		}
		return {
			form
		};
	}
};

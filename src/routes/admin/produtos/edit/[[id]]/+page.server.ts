import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { produtoSchema } from '$lib/schemas';
import { supabase } from '$lib/supabase';

export const load = (async (event) => {
	const prodID = event.params.id?.replace('$', '');

	if (prodID !== undefined) {
		const prod = await supabase.from('produtos').select().eq('id', prodID).single();
		//@ts-ignore
		const form = await superValidate(prod.data, produtoSchema);
		return { form };
	}

	const form = await superValidate(event, produtoSchema);
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const prodID = event.params.id?.replace('$', '');

		const form = await superValidate(event, produtoSchema);

		console.log(form.data);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		//if prodID is undefined, it's a new product
		if (prodID === undefined) {
			const { data, error } = await supabase.from('produtos').insert(form.data);
			console.log('created new product');

			console.log(data);

			if (error) {
				// return fail(500, {
				// 	error
				// });
				console.log(error);
			}
		} else {
			const { data, error } = await supabase.from('produtos').update(form.data).eq('id', prodID);
			console.log(error);

			console.log('updated product');
			console.log(data);

			if (error) {
				console.log(error);
			}
		}
		return { form };
	}
};

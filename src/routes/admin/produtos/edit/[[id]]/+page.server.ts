import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { produtoSchema } from '$lib/schemas';
// import { supabase } from '$lib/supabase';

export const load = (async (event) => {
	const supabase = event.locals.supabase;
	const prodID = event.params.id?.replace('$', '');

	if (prodID !== undefined) {
		const { data } = await supabase.from('produtos').select().eq('id', prodID).single();
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		const form = await superValidate(data, produtoSchema);
		return { form };
	}

	const form = await superValidate(event, produtoSchema);
	return { form ,supabase};

}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const supabase = event.locals.supabase;
		const prodID = event.params.id?.replace('$', '');

		console.log('prodID: ' + parseInt(prodID ?? ''));

		const form = await superValidate(event, produtoSchema);

		console.log(form.data);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		//if prodID is undefined, it's a new product
		if (prodID === undefined) {
			const { data, error } = await supabase.from('produtos').insert(form.data).select();

			console.log('created new product');
			console.log(data);

			if (error) {
				// return fail(500, {
				// 	error
				// });
				console.log(error);
			}
		} else {
			// TODO: FIX update product
			const { data, error } = await supabase
				.from('produtos')
				.update(form.data)
				.eq('id', parseInt(prodID))
				.single();

			console.log('updated product');
			console.log(data);

			if (error) {
				console.log(error);
			}
		}
		return { form };
	}
};

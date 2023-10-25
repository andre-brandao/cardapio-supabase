import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { produtoSchema } from '$lib/schemas';
// import { supabase } from '$lib/supabase';

export const load = (async (event) => {
	const supabase = event.locals.supabase;
	const prodID = event.params.id?.replace('$', '');

	if (prodID != undefined) {
		const { data, error } = await supabase.from('produtos').select().eq('id', prodID).single();

		if (error) {
			console.log(error);
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		const form = await superValidate(data, produtoSchema);
		return { form };
	}

	const form = await superValidate(event, produtoSchema);
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	formsubmit: async (event) => {
		const supabase = event.locals.supabase;
		const prodID = event.params.id;

		console.log('prodID: ' + parseInt(prodID ?? ''));

		const form = await superValidate(event, produtoSchema);

		console.log(form.data);

		if (!form.valid) {
			console.log('invalid form');

			return fail(400, {
				form
			});
		}
		//if prodID is undefined, it's a new product
		if (prodID === undefined) {
			console.log('CREATE');

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
			console.log('UPDATE');

			// TODO: FIX update product
			const { data, error, status } = await supabase
				.from('produtos')
				.update({
					id: parseInt(prodID),
					...form.data
				})
				.eq('id', parseInt(prodID));

			console.log('updated product');
			console.log(data);
			console.log(status);

			if (error) {
				console.log(error);
			}
		}

		return { form };
	}
};

import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';
// import { z } from 'zod';
// import { fail } from '@sveltejs/kit';

// import { produtoSchema } from '$lib/schemas';

export const load = (async () => {
	const { data } = await supabase.from('produtos').select();

	return {
		produtos: data ?? []
	};
}) satisfies PageServerLoad;

// export const actions = {
// 	default: async (request) => {
// 		const formData = Object.fromEntries(await request.request.formData());

// 		console.log(formData);

// 		try {
// 			const data = produtoSchema.parse(formData);
// 			console.log(data);
// 		} catch (err) {
// 			if (err instanceof z.ZodError) {
// 				return fail(400, {
// 					message: 'Validation Error',
// 					errors: err.flatten().fieldErrors
// 				});
// 			}
// 			return fail(400, {
// 				message: 'Something went wrong',
// 				errors: {}
// 			});
// 		}

// 		return {
// 			success: true
// 		};
// 	}
// };

import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const supabase = event.locals.supabase;

	const { data: clientes, error } = await supabase.from('clientes').select('*');

	if (error) {
		console.log(error);
	}
	return { clientes: clientes ?? [] };
}) satisfies PageServerLoad;

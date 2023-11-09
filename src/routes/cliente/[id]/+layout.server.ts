import type { LayoutServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const supabase = locals.supabase;
	const clienteID = params.id;
	const { data: cliente, error } = await supabase
		.from('clientes')
		.select()
		.eq('id', clienteID)
		.single();

	if (error) {
		console.log(error);
	}

	return {
		cliente
	};
}) satisfies LayoutServerLoad;

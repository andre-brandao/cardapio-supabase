import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
	const supabase = event.locals.supabase;
	const clienteID = event.params.id;
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

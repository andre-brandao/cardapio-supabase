import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const supabase = event.locals.supabase;

	const { data: pedidos, error } = await supabase
		.from('pedidos')
		.select('*, produtos (*), clientes(*), adicional(*)')
		.neq('status', 'Entregue')
		.order('created_at', { ascending: false });
	// .neq('status', 'Entregue');

	if (error) {
		console.log(error);
	}
	console.log(pedidos);

	return { pedidos: pedidos ?? [] };
}) satisfies PageServerLoad;

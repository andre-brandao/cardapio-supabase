import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const supabase = event.locals.supabase;

	const clienteID = event.params.id;


	console.log(clienteID);

	const { data: pedidos, error } = await supabase
		.from('pedidos')
		.select('*, produtos (*), adicional(*)')
		.eq('cliente_id', clienteID);

	if (error) {
		console.log(error);
	}
	console.log(pedidos);

	const { data: cliente } = await supabase.from('clientes').select().eq('id', clienteID).single();

	return { pedidos: pedidos ?? [], cliente, session: event.locals.getSession() };
}) satisfies PageServerLoad;

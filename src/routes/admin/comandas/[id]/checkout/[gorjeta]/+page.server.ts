import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const supabase = locals.supabase;
	const clienteID = params.id;
	const { data: pedidos } = await supabase
		.from('pedidos')
		.select('*, produtos (*)')
		.eq('cliente_id', clienteID)
		.eq('pago', '')
		.neq('status', 'Cancelado');
	const { data: cliente } = await supabase.from('clientes').select().eq('id', clienteID).single();
	return { pedidos, cliente };
}) satisfies PageServerLoad;

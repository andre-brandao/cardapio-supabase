import type { LayoutServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const supabase = locals.supabase;
	const clienteID = params.id;
	const { data: cliente } = await supabase.from('clientes').select().eq('id', clienteID).single();

	const { data: produtos } = await supabase.from('produtos').select().eq('visible', true);

	const { data: pedidos } = await supabase
		.from('pedidos')
		.select('*, produtos (*)')
		.order('created_at', { ascending: false })
		.eq('cliente_id', clienteID);

	return {
		cliente ,
		pedidos,
		produtos
	};
}) satisfies LayoutServerLoad;

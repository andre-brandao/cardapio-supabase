import type { LayoutServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const supabase = locals.supabase;
	const clienteID = params.id;

	// const { data: cliente } = await supabase.from('clientes').select().eq('id', clienteID).single();

	// const { data: produtos } = await supabase.from('produtos').select().eq('visible', true);

	// const { data: pedidos } = await supabase
	// 	.from('pedidos')
	// 	.select('*, produtos (*)')
	// 	.order('created_at', { ascending: false })
	// 	.eq('cliente_id', clienteID);

	const getCliente = async () => {
		const { data: cliente } = await supabase.from('clientes').select().eq('id', clienteID).single();
		return cliente;
	};

	const getProdutos = async () => {
		const { data: produtos } = await supabase.from('produtos').select().eq('visible', true);
		return produtos;
	};


	return {
		cliente:  getCliente(),
		produtos:  getProdutos()
	};
}) satisfies LayoutServerLoad;

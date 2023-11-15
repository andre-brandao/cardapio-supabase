import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const supabase = event.locals.supabase;
	const admin_permitions = (await event.parent()).admin_permitions;
	if (!admin_permitions || !admin_permitions.perm_pedidos ) {
		throw error(403, 'sem permissoes para acessar essa pagina');

	}
	const { data: pedidos } = await supabase
		.from('pedidos')
		.select('*, produtos (*), clientes(*), adicional(*)')
		.neq('status', 'Entregue')
		.order('created_at', { ascending: false });
	// .neq('status', 'Entregue');


	console.log(pedidos);

	return { pedidos: pedidos ?? [] };
}) satisfies PageServerLoad;

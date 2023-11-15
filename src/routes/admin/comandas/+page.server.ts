import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const supabase = event.locals.supabase;
	const admin_permitions = (await event.parent()).admin_permitions;
	if (!admin_permitions || !admin_permitions.perm_comanda) {
		throw error(403, 'sem permissoes para acessar essa pagina');

	}
	const { data: clientes } = await supabase
		.from('clientes')
		.select('*')
		.is('checkout_date', null);


	return { clientes: clientes ?? [] };
}) satisfies PageServerLoad;

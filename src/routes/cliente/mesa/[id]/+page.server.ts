import type { PageServerLoad } from './$types';

// import { supabase } from '$lib/supabase';

function getIdString(id: string): string {
	const idMap = new Map<string, string>([
		['QGRo1', 'Suite 1'],
		['QVRc2', 'Suite 2'],
		['Q81s3', 'Suite 3'],
		['C9Zt1', 'Chale 1'],
		['C1Zt2', 'Chale 2'],
		['C2Zt3', 'Chale 3'],
		['C3Zt4', 'Chale 4'],
		['Vd736', 'Visitante']
	]);

	return idMap.get(id) || 'Invalid ID';
}
export const load = (async ({ params, locals }) => {
	const identificador = getIdString(params.id);

	const supabase = locals.supabase;

	const { data: clientes, error } = await supabase
		.from('clientes')
		.select('*')
		.is('checkout_date', null)
		.eq('mesa', identificador);

	if (error) {
		console.error(error);
	}

	return {
		clientes: clientes ?? [],
		mesa: identificador
	};
}) satisfies PageServerLoad;

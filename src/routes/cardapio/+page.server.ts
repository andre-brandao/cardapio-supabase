import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const supabase = locals.supabase;

	const getProdutos = async () => {
		const { data: produtos } = await supabase.from('produtos').select().eq('visible', true);
		return produtos;
	};

	return { produtos: (await getProdutos()) ?? [] };
}) satisfies PageServerLoad;

import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const supabase = event.locals.supabase;

	const { data, error } = await supabase
    .from('produtos')
    .select().eq('visible', true);
	
    if (error) {
        console.log(error);
        
    }

    return { produtos: data ?? [] };
}) satisfies PageServerLoad;

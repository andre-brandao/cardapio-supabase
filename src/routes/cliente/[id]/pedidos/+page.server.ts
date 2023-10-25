import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const supabase = event.locals.supabase;

    const clienteID = event.params.id;

    console.log(clienteID);
    
	const { data: pedidos, error } = await supabase
		.from('pedidos')
		.select('*, produtos (*)')
		.eq('cliente_id', clienteID);

        if (error) {
            console.log(error);
            
        }
        console.log(pedidos);
        

	return { pedidos: pedidos ?? [] };
}) satisfies PageServerLoad;

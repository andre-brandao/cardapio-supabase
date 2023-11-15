import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
// import { supabase } from '$lib/supabase';
// import { z } from 'zod';
// import { fail } from '@sveltejs/kit';

// import { produtoSchema } from '$lib/schemas';

export const load = (async ({ locals, parent }) => {
	const supabase = locals.supabase;

	const admin_permitions = (await parent()).admin_permitions;
	if (!admin_permitions || !admin_permitions.perm_editar_cardapio) {
		throw error(403, 'sem permissoes para acessar essa pagina');
	}
	// insertProdutos(supabase)
	const { data } = await supabase.from('produtos').select();
	return {
		produtos: data ?? []
	};
}) satisfies PageServerLoad;

// import prodJSON from '$lib/produtos.json';
// async function insertProdutos(supabase) {
// 	for (const produto of prodJSON) {
// 		// console.log(produto);

// 		//ts-ignore
// 		// const preco = parseFloat(produto.preco) * 100;
// 		console.log(produto);

// 		await supabase.from('produtos').insert({
// 			categoria: produto.categoria,

// 			descricao: produto.descricao,

// 			image_url: produto.url,
// 			nome: produto.nome,
// 			preco_in_cents: parseFloat(produto.preco) * 100,
// 			sub_categoria: produto.subcategoria,
// 			vegan: produto.vegano,
// 			visible: produto.visivel
// 		});
// 	}
//}

// export const actions = {
// 	default: async (request) => {
// 		const formData = Object.fromEntries(await request.request.formData());

// 		console.log(formData);

// 		try {
// 			const data = produtoSchema.parse(formData);
// 			console.log(data);
// 		} catch (err) {
// 			if (err instanceof z.ZodError) {
// 				return fail(400, {
// 					message: 'Validation Error',
// 					errors: err.flatten().fieldErrors
// 				});
// 			}
// 			return fail(400, {
// 				message: 'Something went wrong',
// 				errors: {}
// 			});
// 		}

// 		return {
// 			success: true
// 		};
// 	}
// };

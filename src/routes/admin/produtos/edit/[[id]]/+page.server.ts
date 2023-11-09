import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { produtoSchema } from '$lib/schemas';
import type { SupabaseClient } from '@supabase/supabase-js';
// import { supabase } from '$lib/supabase';
interface Produto {
	nome: string;
	descricao: string;
	categoria: string;
	preco_in_cents: number;
	image_url: string;
	vegan: boolean;
	visible: boolean;
}
interface Adicional {
	id?: number;
	produto_id?: number;
	nome: string;
	preco_in_cents: number;
}
export const load = (async (event) => {
	const supabase = event.locals.supabase;
	const prodID = event.params.id?.replace('$', '');

	if (prodID != undefined) {
		const { data: produtos, error } = await supabase
			.from('produtos')
			.select('*, adicional(*)')
			.eq('id', prodID)
			.single();

		if (error) {
			console.log(error);
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		const form = await superValidate(produtos, produtoSchema);
		return { form };
	}

	const form = await superValidate(event, produtoSchema);
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	delete: async (event) => {
		const supabase = event.locals.supabase;
		const prodID = event.params.id;

		console.log('prodID: ' + prodID);
		console.log(typeof prodID);

		const response = await supabase
			.from('produtos')
			.delete()
			.match({ id: parseInt(prodID!) });
		console.log(response);
	},

	formsubmit: async (event) => {
		const supabase = event.locals.supabase;
		const prodID = event.params.id;

		console.log('prodID: ' + parseInt(prodID ?? ''));

		const form = await superValidate(event, produtoSchema);

		console.log(form.data);

		if (!form.valid) {
			console.log('invalid form');
			console.log(form);
			console.log(form.errors.adicional);

			return fail(400, {
				form
			});
		}

		const produto = {
			...form.data
		};
		// @ts-ignore
		delete produto.adicional;

		const adicional = form.data.adicional;
		//if prodID is undefined, it's a new product
		if (prodID === undefined) {
			await createProduct(supabase, produto, adicional);
		} else {
			await updateProduct(supabase, produto, parseInt(prodID), adicional);
			// await upsertAdicionais(supabase, adicional, parseInt(prodID));
		}

		return { form };
	}
};

async function createProduct(supabase: SupabaseClient, produto: Produto, adicionais: Adicional[]) {
	console.log('CREATE');

	const { data, error } = await supabase.from('produtos').insert(produto).select('*');

	console.log('created new product with id ' + data?.[0].id);
	console.log(data);
	if (adicionais.length > 0 && data?.[0].id != undefined) {
		await upsertAdicionais(supabase, adicionais, data?.[0].id);
	}
	if (error) {
		console.log(error);
	} else {
		throw redirect(303, '/admin/produtos');
	}
}

async function updateProduct(
	supabase: SupabaseClient,
	produto: Produto,
	prodID: number,
	adicionais: Adicional[]
) {
	console.log('UPDATE');

	const { data, error, status } = await supabase
		.from('produtos')
		.update(produto)
		.match({ id: prodID });

	console.log('updated product');
	console.log(data);
	console.log(status);
	if (adicionais.length > 0) {
		await upsertAdicionais(supabase, adicionais, prodID);
	}
	if (error) {
		console.log(error);
	} else {
		throw redirect(303, '/admin/produtos');
	}
}

async function upsertAdicionais(supabase: SupabaseClient, adicionais: Adicional[], prodID: number) {
	console.log('UPDATE ADICIONAIS');
	console.log(adicionais);
	adicionais = adicionais.map((adicional) => {
		adicional.produto_id = prodID;
		return adicional;
	});
	const { data, error, status } = await supabase.from('adicional').upsert(adicionais);
	// .match({ produto_id: prodID });

	console.log('updated adicionais');
	console.log(data);
	console.log(status);

	if (error) {
		console.log(error);
	} else {
		throw redirect(303, '/admin/produtos');
	}
}

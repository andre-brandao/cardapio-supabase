import { stripe } from '$lib/stripe';
import type { RequestHandler } from './$types';
// import type { CartItem } from "../cart";
// import { env } from '$env/dynamic/private';
// import { page } from '$app/stores';
import { redirect } from '@sveltejs/kit';

// interface LineItem {
// 	price_data: {
// 		currency: string;
// 		product_data: {
// 			name: string;
// 			images: string[];
// 		};
// 		unit_amount: number;
// 	};
// 	quantity: number;
// }

export const GET: RequestHandler = async ({ url, locals, params }) => {
	console.log(url.href);

	const supabase = locals.supabase;

	const clienteID = params.id;
	if (clienteID === undefined) {
		//error redirect
		return new Response();
	}
	const { data, error } = await supabase
		.from('pedidos')
		.select('*, produtos (*)')
		.eq('status', 'Entregue')
		.eq('cliente_id', clienteID);
	
	if (!data) {
		return new Response(error.message, { status: 500 });
	}
	const lineItems = data.map((item) => {
		console.log(item);
		
		return {
			price_data: {
				currency: 'BRL',
				product_data: {
					name: item.produtos?.nome ?? 'erro nome',
					images: [item.produtos?.image_url ?? 'https://firebasestorage.googleapis.com/v0/b/svelte-cardapio.appspot.com/o/static%2Fno_image.jpg?alt=media&token=cf56867b-39f9-4419-9d6c-aa94d7ce640a']
				},
				unit_amount: item.total_in_cents
			},
			quantity: 1
		};
	});
	// TODO GET URL
	// Create session
	const session = await stripe.checkout.sessions.create({
		line_items: lineItems,
		shipping_address_collection: {
			allowed_countries: []
		},
		mode: 'payment',
		success_url: `${url.href}/success`,
		cancel_url: `${url.href}/cancel`,
		phone_number_collection: {
			enabled: true
		}, 
	});

	throw redirect(301, session.url ?? '');

	return new Response(
		JSON.stringify({
			url: session.url
			// url: 'https://google.com'
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};

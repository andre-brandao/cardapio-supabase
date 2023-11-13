import type { PageServerLoad } from './$types';
import { stripe } from '$lib/stripe';
import { redirect } from '@sveltejs/kit';
// import type { SupabaseClient } from '@supabase/supabase-js';
export const load = (async ({ locals, params, url }) => {
	const supabase = locals.supabase;

	const clienteID = params.id;
	const gorjeta = params.gorjeta;

	const { data, error } = await supabase
		.from('pedidos')
		.select('*, produtos (*)')
		.eq('cliente_id', clienteID)
		.eq('pago', '')
		.neq('status', 'Cancelado');

	if (!data) {
		return new Response(error.message, { status: 500 });
	}

	let total = 0;
	const lineItems = data.map((item) => {
		console.log(item);
		total += item.total_in_cents;

		const nome = item.produtos?.nome ?? 'erro nome';
		const preco = item.total_in_cents;


		const img = item.produtos?.image_url
			? item.produtos?.image_url
			: 'https://firebasestorage.googleapis.com/v0/b/svelte-cardapio.appspot.com/o/static%2Fno_image.jpg?alt=media&token=cf56867b-39f9-4419-9d6c-aa94d7ce640a';

		return {
			price_data: {
				currency: 'BRL',
				product_data: {
					name: nome,
					images: [img]
				},
				unit_amount: preco
			},
			quantity: 1
		};
	});

	let totalGorjeta = 0;
	if (gorjeta != '0') {
		totalGorjeta = Math.round(total * (parseInt(gorjeta) / 100));
		console.log('GORJETA = ' + totalGorjeta);

		lineItems.push({
			price_data: {
				currency: 'BRL',
				product_data: {
					name: `Gorjeta ${gorjeta}%`,
					images: []
				},
				unit_amount: totalGorjeta
			},
			quantity: 1
		});
	}

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
		metadata: {
			cliente_id: clienteID,
			total_in_cents: total + totalGorjeta,
			total_gorjeta: totalGorjeta
		}
	});

	// addStripePaymentID(supabase, session.id, clienteID);
	console.log(session.id);

	throw redirect(301, session.url ?? '');

	return {};
}) satisfies PageServerLoad;

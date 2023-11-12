import type { PageServerLoad } from './$types';
import { stripe } from '$lib/stripe';
import { redirect } from '@sveltejs/kit';
// import type { SupabaseClient } from '@supabase/supabase-js';
export const load = (async ({ locals, params, url }) => {
	const supabase = locals.supabase;

	const clienteID = params.id;

	const { data, error } = await supabase
		.from('pedidos')
		.select('*, produtos (*)')
		.eq('cliente_id', clienteID)
		.neq('status', 'Cancelado')

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
					images: [
						item.produtos?.image_url ??
							'https://firebasestorage.googleapis.com/v0/b/svelte-cardapio.appspot.com/o/static%2Fno_image.jpg?alt=media&token=cf56867b-39f9-4419-9d6c-aa94d7ce640a'
					]
				},
				unit_amount: item.total_in_cents
			},
			quantity: 1
		};
	});
	
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
			cliente_id: clienteID
		}
	});

	// addStripePaymentID(supabase, session.id, clienteID);
	console.log(session.id);

	throw redirect(301, session.url ?? '');

	// return {};
}) satisfies PageServerLoad;

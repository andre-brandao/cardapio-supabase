// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Import via bare specifier thanks to the import_map.json file.
import Stripe from 'https://esm.sh/stripe@12.1.1?target=deno';

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const supabase = createClient(
	Deno.env.get('SUPABASE_URL') as string,
	Deno.env.get('SUPABASE_ANON_KEY') as string
);

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string, {
	// This is needed to use the Fetch API rather than relying on the Node http
	// package.
	apiVersion: '2023-08-16',
	httpClient: Stripe.createFetchHttpClient()
});
// This is needed in order to use the Web Crypto API in Deno.
const cryptoProvider = Stripe.createSubtleCryptoProvider();

// console.log('Hello from Functions!');

Deno.serve(async (request) => {
	const signature = request.headers.get('Stripe-Signature');

	// First step is to verify the event. The .text() method must be used as the
	// verification relies on the raw request body rather than the parsed JSON.
	const body = await request.text();
	let receivedEvent;
	try {
		receivedEvent = await stripe.webhooks.constructEventAsync(
			body,
			signature,
			Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET'),
			undefined,
			cryptoProvider
		);
	} catch (err) {
		console.log(`⚠️  Webhook signature verification failed.`);
		console.log(err.message);

		return new Response(err.message, { status: 400 });
	}
	// console.log(`🔔 Event received: ${receivedEvent.id}`);
	console.log(receivedEvent);

	// Handle the event
	switch (receivedEvent.type) {
		// case 'payment_intent.created': {
		// 	const paymentIntentCreated = receivedEvent.data.object;
		// 	console.log('payment_intent.created');

		// 	console.log(paymentIntentCreated.id);

		// 	// Then define and call a function to handle the receivedEvent payment_intent.created
		// 	break;
		// }
		// case 'payment_intent.succeeded': {
		// 	const paymentIntentSucceeded = receivedEvent.data.object;

		// 	console.log('payment_intent.succeeded');
		// 	console.log(paymentIntentSucceeded.id);

		// 	// Then define and call a function to handle the receivedEvent payment_intent.succeeded
		// 	break;
		// }
		case 'checkout.session.completed': {
			const checkoutSessionCompleted = receivedEvent.data.object;
			console.log('checkout.session.completed');
			console.log(checkoutSessionCompleted);
			
			// Then define and call a function to handle the event checkout.session.completed
			break;
		}
		// ... handle other receivedEvent types
		default: {
			console.log(`Unhandled receivedEvent type ${receivedEvent.type}`);
		}
	}

	return new Response(JSON.stringify({ ok: true }), { status: 200 });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'

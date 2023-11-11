import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({params}) => {

	throw redirect(301, `/cliente/${params.id}/pedidos`)
	return {};
}) satisfies PageServerLoad;

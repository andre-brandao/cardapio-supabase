import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	return { session: null };
}) satisfies LayoutServerLoad;

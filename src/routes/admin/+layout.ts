// src/routes/+layout.ts
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import type { Database } from '$lib/supabase-types';

export const load = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createSupabaseLoadClient<Database>({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	async function getPermAdmin() {
		if (session === null) {
			return null;
		}
		const { data } = await supabase
			.from('info_admin')
			.select('*')
			.eq('id', session.user.id)
			.single();
		return data;
	}
	// console.log(session);

	return { supabase, session, admin_permitions: await getPermAdmin() };
};

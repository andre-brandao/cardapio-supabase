import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession, supabase } }) => {
	const session = await getSession();

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
	return {
		session,
		admin_permitions: await getPermAdmin()
	};
};

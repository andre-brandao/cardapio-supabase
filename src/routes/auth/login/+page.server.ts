// src/routes/login/+page.server.ts
import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signUp({
			email,
			password,
			// options: {
			// 	emailRedirectTo: `${url.origin}/auth/callback`
			// }
		});

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, { message: 'Invalid email address.', success: false, email });
			}
			return fail(500, { message: 'Server error. Try again later.', success: false, email });
		}

        
        throw redirect(303, '/admin/produtos');
		// return {
		// 	message: 'Please check your email for a magic link to log into the website.',
		// 	success: true
		// };
	}
};

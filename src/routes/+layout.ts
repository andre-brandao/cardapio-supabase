import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { LayoutLoad } from './$types'
import { combineChunks, createBrowserClient, isBrowser, parse } from '@supabase/ssr'

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
  depends('supabase:auth')

  const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      fetch,
    },
    cookies: {
      get(key) {
        if (!isBrowser() && data) {
          return JSON.stringify(data.session)
        }

        const cookie = combineChunks(key, (name) => {
          const cookies = parse(document.cookie)
          return cookies[name]
        })
        return cookie
      },
    },
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: true,
    }
  })

  

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return { supabase, session }
}
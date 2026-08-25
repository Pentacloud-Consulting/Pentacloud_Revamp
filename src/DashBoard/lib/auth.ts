import { createClientServer } from './supabase'

export async function getUserSession() {
  const supabase = await createClientServer()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error getting session', error)
    return null
  }
}

export async function requireAuth() {
  const session = await getUserSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

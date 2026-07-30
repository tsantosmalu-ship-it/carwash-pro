import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/shared/lib/supabase'
import { fetchUsuarioRole, signOut as signOutApi } from '../api/auth.api'
import type { AuthUser } from '../types'

interface AuthContextValue {
  session: Session | null
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadUser(currentSession: Session | null) {
      if (!currentSession?.user) {
        if (active) {
          setUser(null)
          setLoading(false)
        }
        return
      }
      try {
        const role = await fetchUsuarioRole(currentSession.user.id)
        if (active) {
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email ?? null,
            role,
          })
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      loadUser(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setLoading(true)
      loadUser(newSession)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  async function signOut() {
    await signOutApi()
  }

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

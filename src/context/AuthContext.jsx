import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const Ctx = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(uid) {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
    setProfile(data); setLoading(false); return data
  }

  async function signUp(email, password, data) {
    const { data: auth, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (auth.user) {
      const { error: pe } = await supabase.from('profiles').insert({ id: auth.user.id, ...data, city: 'Belgaum', plan: 'free' })
      if (pe) throw pe
    }
    return auth
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    await supabase.auth.signOut(); setUser(null); setProfile(null)
  }

  async function forgotPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  async function updateProfile(updates) {
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
    if (!error) setProfile(p => ({ ...p, ...updates }))
    return { error }
  }

  return (
    <Ctx.Provider value={{ user, profile, loading, signUp, signIn, signOut, forgotPassword, updateProfile, loadProfile }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)

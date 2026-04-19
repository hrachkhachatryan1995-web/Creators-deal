import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'

async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  let data = {}
  try {
    data = await response.json()
  } catch {
    data = {}
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed')
  }

  return data
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function refreshSession() {
    try {
      const data = await requestJson('/api/auth-session', { method: 'GET' })
      setUser(data.user || null)
      return data.user || null
    } catch {
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshSession()
  }, [])

  async function register(payload) {
    try {
      const data = await requestJson('/api/auth-register', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      return data
    } finally {
      setLoading(false)
    }
  }

  async function login(payload) {
    try {
      const data = await requestJson('/api/auth-login', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setUser(data.user || null)
      return data
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await requestJson('/api/auth-logout', { method: 'POST' })
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function syncPlan() {
    try {
      const data = await requestJson('/api/sync-plan', { method: 'POST' })
      setUser(data.user || null)
      return data
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        isVerified: Boolean(user?.isVerified),
        isPaid: user?.plan === 'pro',
        refreshSession,
        register,
        login,
        logout,
        syncPlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

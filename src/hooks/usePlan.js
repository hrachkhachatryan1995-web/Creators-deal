import { useAuth } from '../auth/useAuth'

export default function usePlan() {
  const { user, isPaid, loading, refreshSession } = useAuth()
  return {
    plan: user?.plan || 'free',
    isPaid,
    loading,
    refreshPlan: refreshSession,
    user,
  }
}

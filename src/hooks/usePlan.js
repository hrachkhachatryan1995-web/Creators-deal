import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const PLAN_STORAGE_KEY = 'creator-deal-plan-v1'
const PAID_PLANS = ['pro']

export default function usePlan() {
  const location = useLocation()
  const navigate = useNavigate()
  const [plan, setPlan] = useState(() => {
    return localStorage.getItem(PLAN_STORAGE_KEY) || 'free'
  })

    // When Lemon Squeezy redirects back with ?plan=pro, persist it
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const planParam = params.get('plan')?.toLowerCase()
    if (planParam && PAID_PLANS.includes(planParam)) {
      localStorage.setItem(PLAN_STORAGE_KEY, planParam)
      setPlan(planParam)
      // Clean the URL param without a full navigation
      navigate(location.pathname, { replace: true })
    }
  }, [location.search, location.pathname, navigate])

  const isPaid = PAID_PLANS.includes(plan)

  function upgradeToPro() {
    localStorage.setItem(PLAN_STORAGE_KEY, 'pro')
    setPlan('pro')
  }

  return { plan, isPaid, upgradeToPro }
}

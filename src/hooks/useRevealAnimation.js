import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function useRevealAnimation(options = {}) {
  const rootRef = useRef(null)

  useEffect(() => {
    if (!rootRef.current) {
      return undefined
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      const hero = rootRef.current.querySelectorAll('[data-hero]')
      const cards = rootRef.current.querySelectorAll('[data-card]')
      const stats = rootRef.current.querySelectorAll('[data-stat]')

      const allTargets = [...hero, ...stats, ...cards]

      if (!allTargets.length) {
        return
      }

      gsap.set(allTargets, { autoAlpha: 1 })

      if (hero.length) {
        timeline.fromTo(hero, {
          y: 28,
          autoAlpha: 0,
        }, {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.12,
          clearProps: 'all',
        })
      }

      if (stats.length) {
        timeline.fromTo(
          stats,
          {
            y: 18,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.45,
            stagger: 0.08,
            clearProps: 'all',
          },
          '-=0.35',
        )
      }

      if (cards.length) {
        timeline.fromTo(
          cards,
          {
            y: 20,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            stagger: options.cardStagger || 0.08,
            clearProps: 'all',
          },
          '-=0.3',
        )
      }
    }, rootRef)

    return () => context.revert()
  }, [options.cardStagger])

  return rootRef
}

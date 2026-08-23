"use client"

import { useEffect } from 'react'

export default function SetLang() {
  useEffect(() => {
    try {
      const path = window.location.pathname || '/'
      const first = path.split('/')[1]
      let lang = 'pt'
      if (first === 'en') lang = 'en'
      else if (first === 'uk') lang = 'uk'
      else if (first === 'pt') lang = 'pt'
      document.documentElement.lang = lang
    } catch (e) {
      // ignore
    }
  }, [])

  return null
}

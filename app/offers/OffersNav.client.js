"use client"
import React from "react"
import { createPortal } from "react-dom"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function OffersNav({ copy }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isSmall, setIsSmall] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)

    const currentUrl = React.useMemo(() => {
        const search = searchParams?.toString()
        return search ? `${pathname}?${search}` : pathname
    }, [pathname, searchParams])

    React.useEffect(() => {
        setMounted(true)
        const mq = window.matchMedia('(max-width: 650px)')
        const onChange = e => setIsSmall(e.matches)
        onChange(mq)
        mq.addEventListener?.('change', onChange)
        return () => mq.removeEventListener?.('change', onChange)
    }, [])

    React.useEffect(() => {
        // reserve space at the bottom of the page so fixed nav doesn't cover content
        if (typeof document === 'undefined') return
        document.body.style.paddingBottom = isSmall ? '70px' : ''
        return () => { document.body.style.paddingBottom = '' }
    }, [isSmall])

    const navButtons = (
        <>
            <button onClick={() => router.push("/#explore")}>{copy?.navExplore || "Explorar"}</button>
            <button onClick={() => router.push(`/profile?returnTo=${encodeURIComponent(currentUrl)}`)}>{copy?.navMine || "Meu perfil"}</button>
            <button onClick={() => router.push("/#wishlist")}>{copy?.navWish || "Lista de Desejos"}</button>
            <button onClick={() => router.push("/chat")}>{copy?.navMessages || "Mensagens"}</button>
            {/* <button onClick={() => router.push("/#how")}>{copy?.navHow || "Como funciona"}</button>
            <button onClick={() => router.push("/#premium")}>{copy?.navAbout || "Sobre"}</button> */}
        </>
    )

    // On small screens the nav is teleported to <body> via a portal so it isn't
    // trapped inside the header's containing block (the header uses backdrop-filter,
    // which makes `position: fixed` descendants pin to the header instead of the viewport).
    // Positioning/layout for this state lives in globals.css (.desktop-nav.bottom-fixed).
    if (isSmall) {
        if (!mounted) return null
        return createPortal(
            <nav className="desktop-nav always-show bottom-fixed">
                {navButtons}
            </nav>,
            document.body
        )
    }

    return (
        <nav className="desktop-nav always-show">
            {navButtons}
        </nav>
    )
}
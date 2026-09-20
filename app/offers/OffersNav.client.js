"use client"
import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function OffersNav({ copy }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentUrl = React.useMemo(() => {
        const search = searchParams?.toString()
        return search ? `${pathname}?${search}` : pathname
    }, [pathname, searchParams])

    return (
        <nav className="desktop-nav">
            <button onClick={() => router.push("/#explore")}>{copy?.navExplore || "Explorar"}</button>
            <button onClick={() => router.push(`/profile?returnTo=${encodeURIComponent(currentUrl)}`)}>{copy?.navMine || "Meu perfil"}</button>
            <button onClick={() => router.push("/#wishlist")}>{copy?.navWish || "Lista de Desejos"}</button>
            <button onClick={() => router.push("/chat")}>{copy?.navMessages || "Mensagens"}</button>
            {/* <button onClick={() => router.push("/#how")}>{copy?.navHow || "Como funciona"}</button>
            <button onClick={() => router.push("/#premium")}>{copy?.navAbout || "Sobre"}</button> */}
        </nav>
    )
}
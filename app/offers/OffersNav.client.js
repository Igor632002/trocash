"use client"
import React from "react"
import { useRouter } from "next/navigation"

export default function OffersNav({ copy }) {
    const router = useRouter()
    return (
        <nav className="desktop-nav">
            <button onClick={() => router.push("/#explore")}>{copy?.navExplore || "Explorar"}</button>
            <button onClick={() => router.push("/auth")}>{copy?.navMine || "Meu perfil"}</button>
            <button onClick={() => router.push("/#wishlist")}>{copy?.navWish || "Wish List"}</button>
            <button onClick={() => router.push("/#trust")}>{copy?.navMessages || "Mensagens"}</button>
            <button onClick={() => router.push("/#how")}>{copy?.navHow || "Como funciona"}</button>
            <button onClick={() => router.push("/#premium")}>{copy?.navAbout || "Sobre"}</button>
        </nav>
    )
}
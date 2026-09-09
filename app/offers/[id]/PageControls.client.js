"use client";

import { useRouter } from "next/navigation";

export default function PageControls() {
    const router = useRouter();

    const container = {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 12,
        width: "100%",
    };

    const circle = {
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid rgba(17,25,54,0.10)",
        background: "#ffdd66",
        color: "#8b8e98",
        cursor: "pointer",
        padding: 0,
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 1,
    };


    // const goBack = () => {
    //     if (typeof window !== "undefined" && window.history.length > 1) {
    //         router.back();
    //         return;
    //     }

    //     const ref = typeof document !== "undefined" ? document.referrer : "";
    //     if (ref) {
    //         router.push(ref);
    //         return;
    //     }

    //     if (typeof window !== "undefined" && window.opener && !window.opener.closed) {
    //         try {
    //             const openerHref = window.opener.location.href;
    //             if (openerHref) {
    //                 router.push(openerHref);
    //                 return;
    //             }
    //         } catch (e) {
    //             try {
    //                 window.opener.focus();
    //                 window.close();
    //                 return;
    //             } catch (e2) {
    //                 // fallthrough
    //             }
    //         }
    //     }

    //     router.push("/offers");
    // };
    return (
        <div style={container}>
            {/* <button style={circle} onClick={goBack} aria-label="Back">←</button> */}
            <button style={circle} onClick={() => router.push("/")} aria-label="Close">×</button>
        </div>
    );
}
import { notFound } from "next/navigation";
import { fetchOfferById } from "@/lib/dal/offers";
import InterestedButton from "@/app/offers/InterestedButton.client";
import ChatButton from "@/app/offers/ChatButton.client";
import PageControls from "./PageControls.client";


export default async function OfferPage({ params }) {
    const { id } = await params;
    if (!id) {
        console.warn("OfferPage called without params.id");
        return notFound();
    }

    let offer = null;
    try {
        offer = await fetchOfferById(id);
    } catch (err) {
        console.error("fetchOfferById error", err);
        try {
            console.error("fetchOfferById full error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
        } catch (e) {
            console.error("could not stringify fetchOfferById error", e);
        }
    }

    if (!offer) return notFound();

    return (

        <div className="offer-page" style={{ display: "flex", justifyContent: "center", width: "", padding: "20px" }}>
            <article className="offer-card card" style={{ border: "1px solid #ccc", width: "450px", padding: "20px" }}>
                <PageControls />
                <img
                    src={offer.image_url || offer.image || '/placeholder.png'}
                    alt={offer.title}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />

                <div className="card-body">
                    <h1>{offer.title}</h1>
                    <p className="meta">
                        {offer.category?.name} · {offer.location?.name || offer.profiles?.area || offer.area}
                    </p>

                    <p><strong>Descrição:</strong> {offer.description || offer.details || '—'}</p>
                    <p><strong>Desejo:</strong> {offer.wish || '—'}</p>
                    {offer.notes && <p><strong>Notas:</strong> {offer.notes}</p>}

                    <p><strong>Estado:</strong> {offer.status || '—'}</p>

                    <p><strong>Email:</strong> Oculto</p>
                    {/* {offer.profiles?.display_name && offer.profiles.display_name !== "Анонім" && (
                        <InterestedButton offerId={offer.id} />
                    )} */}


                    {offer.profiles?.display_name && offer.profiles.display_name !== "Анонім" && (
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <InterestedButton offerId={offer.id} />

                            <ChatButton
                                offerId={offer.id}
                                ownerId={offer.owner_id}
                            />
                        </div>
                    )}


                    <p><strong>Dados privados do proprietário:</strong> {offer.profiles?.display_name || 'Anónimo'}</p>
                    <p><strong>Criado em:</strong> {offer.created_at ? new Date(offer.created_at).toLocaleString('pt-PT') : '—'}</p>
                </div>
            </article>
        </div>
    );
}


{/* {offer.profiles?.email && offer.profiles?.display_name && offer.profiles.display_name !== 'Анонім' ? (
                        <>
                            <p><strong>Email:</strong> <a href={`mailto:${offer.profiles.email}`}>{offer.profiles.email}</a></p>
                            <InterestedButton offerId={offer.id} />
                        </>
                    ) : (
                        <p><strong>Email:</strong> Oculto</p>
                    )} */}
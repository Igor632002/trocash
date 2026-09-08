import { notFound } from "next/navigation";
import { fetchOfferById } from "@/lib/dal/offers";
import InterestedButton from "@/app/offers/InterestedButton.client";

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
    }

    if (!offer) return notFound();

    return (

        <div className="offer-page" style={{ display: "flex", justifyContent: "center", width: "", padding: "20px" }}>
            <article className="offer-card card" style={{ border: "1px solid #ccc", width: "450px", padding: "20px" }}>      <div
                className="offer-image"
                style={{
                    backgroundImage: `url(${offer.image_url || offer.image || '/placeholder.png'})`,
                    height: "300px",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
                {/* 
                <div className="card-body">
                    <h1>{offer.title}</h1>
                    <p className="meta">
                        {offer.category?.name} · {offer.location?.name || offer.profiles?.area || offer.area}
                    </p>

                    <p><strong>Опис:</strong> {offer.description || offer.details || '—'}</p>
                    <p><strong>Побажання:</strong> {offer.wish || '—'}</p>
                    {offer.notes && <p><strong>Примітки:</strong> {offer.notes}</p>}

                    <p><strong>Статус:</strong> {offer.status || '—'}</p>
                    {offer.profiles?.email && offer.profiles?.display_name && offer.profiles.display_name !== 'Анонім' ? (
                        <>
                            <p><strong>Email:</strong> <a href={`mailto:${offer.profiles.email}`}>{offer.profiles.email}</a></p>
                            <InterestedButton offerId={offer.id} />
                        </>
                    ) : (
                        <p><strong>Email:</strong> Приховано</p>
                    )}
                    <p><strong>Приватні дані власника:</strong>
                        {offer.profiles?.display_name || 'Анонім'}</p>
                    <p><strong>Створено:</strong> {offer.created_at ? new Date(offer.created_at).toLocaleString('uk-UA') : '—'}</p>

                </div> */}

                <div className="card-body">
                    <h1>{offer.title}</h1>
                    <p className="meta">
                        {offer.category?.name} · {offer.location?.name || offer.profiles?.area || offer.area}
                    </p>

                    <p><strong>Descrição:</strong> {offer.description || offer.details || '—'}</p>
                    <p><strong>Desejo:</strong> {offer.wish || '—'}</p>
                    {offer.notes && <p><strong>Notas:</strong> {offer.notes}</p>}

                    <p><strong>Estado:</strong> {offer.status || '—'}</p>
                    {offer.profiles?.email && offer.profiles?.display_name && offer.profiles.display_name !== 'Анонім' ? (
                        <>
                            <p><strong>Email:</strong> <a href={`mailto:${offer.profiles.email}`}>{offer.profiles.email}</a></p>
                            <InterestedButton offerId={offer.id} />
                        </>
                    ) : (
                        <p><strong>Email:</strong> Oculto</p>
                    )}
                    <p><strong>Dados privados do proprietário:</strong> {offer.profiles?.display_name || 'Anónimo'}</p>
                    <p><strong>Criado em:</strong> {offer.created_at ? new Date(offer.created_at).toLocaleString('pt-PT') : '—'}</p>
                </div>



            </article>
        </div>
    );
}
{/* <div className="card-body">
                    <h1>{offer.title}</h1>
                    <p className="meta">{offer.category?.name} · {offer.profiles?.area || offer.area}</p>
                    <p><strong>Oferece:</strong> {offer.wish}</p>
                    <p><strong>Descrição:</strong> {offer.description || offer.details || '—'}</p>
                    <p><strong>Proprietário:</strong> {offer.profiles?.display_name || 'Anónimo'}</p>
                </div> */}
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTranscriptById } from "../transcriptsService";
import type { Transcript } from "../types";
import { useCart } from "../../cart/hooks/useCart";
import { usePurchasedTranscriptIds } from "../../orders/hooks/usePurchasedTranscriptIds";
import { useBuyNow } from "../../checkout/hooks/useBuyNow";
import { RequestServer } from "../../../utils/services";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import { APP_ROUTES } from "../../../constants/appRoutes";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Button from "../../../components/button/Button";
import DetailHeader from "../components/detail/DetailHeader";
import PreviewSection from "../components/detail/PreviewSection";
import PurchaseCard from "../components/detail/PurchaseCard";
import ExpertCard from "../components/detail/ExpertCard";
import RelatedTranscripts from "../components/detail/RelatedTranscripts";
import TranscriptDetailSkeleton from "../components/detail/TranscriptDetailSkeleton";

// Ids are either the legacy plain-number form or the backend's UUID form.
const TRANSCRIPT_ID_PATTERN =
  /^(\d+|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

export default function TranscriptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items: cartItems, addToCart, removeFromCart } = useCart();
  const buyNow = useBuyNow();
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [fullText, setFullText] = useState<string | null>(null);
  const purchasedIds = usePurchasedTranscriptIds();
  const isPurchased = !!id && purchasedIds.includes(id);

  useEffect(() => {
    setTranscript(null);
    setNotFound(false);

    if (!id) return;

    // :id matches any path segment, so a made-up route like /transcripts/checkout
    // would otherwise be sent to the backend and come back as a "not found
    // transcript" - it isn't a real id at all, so treat it the same as any
    // other nonexistent route instead of pretending a lookup happened.
    if (!TRANSCRIPT_ID_PATTERN.test(id)) {
      navigate(APP_ROUTES.home, { replace: true });
      return;
    }

    fetchTranscriptById(id)
      .then(setTranscript)
      .catch(() => setNotFound(true));
  }, [id, navigate]);

  useEffect(() => {
    setFullText(null);

    if (!id || !isPurchased) return;

    RequestServer<{ fullText: string }>(
      API_ENDPOINTS.transcriptFullText.replace(":id", id),
      "GET",
    )
      .then((result) => setFullText(result.fullText))
      .catch(() => setFullText(null));
  }, [id, isPurchased]);

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center px-6 py-24 text-center">
            <p className="text-6xl font-extrabold text-accent-2">404</p>
            <h1 className="mt-4 text-2xl font-bold text-text-primary">
              Transcript Not Found
            </h1>
            <p className="mt-2 max-w-md text-text-secondary">
              The transcript you're looking for isn't available or may have
              been removed.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outlined"
                label="Go to Homepage"
                onClick={() => navigate(APP_ROUTES.home)}
              />
              <Button
                variant="contained"
                label="Search Transcripts"
                onClick={() => navigate(APP_ROUTES.transcripts)}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!transcript) {
    return <TranscriptDetailSkeleton />;
  }

  const handleBuyNow = () => buyNow(transcript);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <DetailHeader transcript={transcript} />

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <PreviewSection
                preview={transcript.preview}
                date={transcript.date}
                geography={transcript.geography}
                coverageHighlights={transcript.coverageHighlights}
                onBuyClick={handleBuyNow}
                isPurchased={isPurchased}
                fullText={fullText}
                transcript={transcript}
              />
              <RelatedTranscripts
                excludeId={transcript.id}
                purchasedIds={purchasedIds}
              />
            </div>

            <div className="sticky top-6 flex flex-col gap-6 self-start lg:col-span-4">
              {!isPurchased && (
                <PurchaseCard
                  price={transcript.price}
                  isInCart={cartItems.some((item) => item.id === transcript.id)}
                  onAddToCart={() => addToCart(transcript)}
                  onRemoveFromCart={() => removeFromCart(transcript.id)}
                  onBuyNow={handleBuyNow}
                />
              )}
              <ExpertCard expert={transcript.expert} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

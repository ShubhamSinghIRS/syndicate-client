import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTranscriptById } from "../transcriptsService";
import type { Transcript } from "../types";
import { useCart } from "../../cart/hooks/useCart";
import { usePurchasedTranscriptIds } from "../../orders/hooks/usePurchasedTranscriptIds";
import { setBuyNowItem } from "../../checkout/buyNowStorage";
import { useAuthDialog } from "../../auth/context/AuthDialogContext";
import { isLoggedIn } from "../../../utils/authUtils";
import { RequestServer } from "../../../utils/services";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import { APP_ROUTES } from "../../../constants/appRoutes";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import DetailHeader from "../components/detail/DetailHeader";
import PreviewSection from "../components/detail/PreviewSection";
import PurchaseCard from "../components/detail/PurchaseCard";
import AuthorCard from "../components/detail/AuthorCard";
import RelatedTranscripts from "../components/detail/RelatedTranscripts";
import TranscriptDetailSkeleton from "../components/detail/TranscriptDetailSkeleton";

export default function TranscriptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items: cartItems, addToCart, removeFromCart } = useCart();
  const { openAuthDialog } = useAuthDialog();
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [fullText, setFullText] = useState<string | null>(null);
  const purchasedIds = usePurchasedTranscriptIds();
  const isPurchased = !!id && purchasedIds.includes(id);

  useEffect(() => {
    setTranscript(null);
    setNotFound(false);

    if (id) {
      fetchTranscriptById(id)
        .then(setTranscript)
        .catch(() => setNotFound(true));
    }
  }, [id]);

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
          <div className="mx-auto max-w-[1400px] px-6 py-10 text-center text-text-secondary">
            We couldn't find that transcript.
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!transcript) {
    return <TranscriptDetailSkeleton />;
  }

  const goToBuyNowCheckout = () => {
    // Bypasses the cart; sessionStorage survives navigation.
    setBuyNowItem(transcript);
    navigate(APP_ROUTES.checkout);
  };

  const handleBuyNow = () => {
    if (isLoggedIn()) {
      goToBuyNowCheckout();
      return;
    }

    // Sign in here, then continue straight to checkout.
    openAuthDialog("signin", goToBuyNowCheckout);
  };

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
                domain={transcript.domain}
                excludeId={transcript.id}
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
              <AuthorCard author={transcript.author} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

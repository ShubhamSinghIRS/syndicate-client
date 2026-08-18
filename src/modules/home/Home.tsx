import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import SearchBar from "../../components/searchbar/SearchBar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import FeatureCard from "./components/feature-card/FeatureCard";
import ForExperts from "./components/for-experts/ForExperts";
import FaqSection from "./components/faq/FaqSection";
import RequestTopicDialog from "../transcripts/components/request-topic-dialog";
import WarningDialog from "../../components/form-close-warning/WarningDialog";
import { useFormCloseWarning } from "../../utils/hooks/useFormCloseWarning";
import { APP_ROUTES } from "../../constants/appRoutes";
import { FEATURE_CARDS } from "./constants/homeConstants";
import { heroButtonStyle } from "./Home.styles";
import styles from "./styles.home.module.css";

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const requestTopicDialog = useFormCloseWarning();

  const handleSearch = (text: string) => {
    if (!text.trim()) return;
    navigate(`${APP_ROUTES.transcripts}?q=${encodeURIComponent(text)}`);
  };

  return (
    <div
      className={`${styles.heroBackground} bg-main-background min-h-screen flex flex-col`}
    >
      <Header />

      <div className="flex-1">
        <div className={`${styles.fullBleedRow} flex flex-col md:flex-row items-center gap-10 py-12 md:py-16 relative`}>
          {/* Hero copy */}
          <div className={`${styles.heroTextCol} flex-1 flex flex-col gap-6 text-left`}>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                <span className="text-text-primary">Real Expertise. </span>
                <br />
                <span className="text-accent-2">Verified and Ready.</span>
              </h1>
              <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-xl">
               Every transcript is built from a real expert's view on a topic the market is actively asking about. Written, researched, & shared firsthand. Search, filter, and get straight to the insight you're looking for
              </p>
            </div>

            {/* Search bar */}
            <div className="w-full max-w-xl">
              <SearchBar
                placeholder="Search transcripts..."
                searchValue={search}
                onChangeFunction={setSearch}
                getOnChange
                onSearch={handleSearch}
                clearTriggersSearch={false}
                maxWidth="100%"
                height="56px"
                submitButtonVariant="orange-circle"
                borderRadius="9999px"
                backgroundColor="var(--color-main-background)"
                boxShadow="0 4px 20px -2px rgba(0, 0, 0, 0.05)"
                inputFontSize="16px"
                m={{ xs: "0", sm: "0" }}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap space-btw gap-12 mt-2">
              <Link to={APP_ROUTES.transcripts}>
                <Button
                  variant="contained"
                  label="Browse transcripts"
                  styles={heroButtonStyle}
                />
              </Link>
              <Button
                variant="outlined"
                label=" Request a Topic"
                onClick={requestTopicDialog.open}
                styles={heroButtonStyle}
              />
            </div>
          </div>

          {/* Hero visual - bleeds to the viewport's right edge; no crop, no
              card border, edges dissolve via the mask in heroImage. */}
          <div className="hidden md:block flex-[1.15] w-full pr-6 md:pr-0">
            <img
              src="/assets/bg_image_side2.png"
              alt="Expert sharing insights on a video call"
              className={`${styles.heroImage} w-full h-auto max-h-[480px] object-contain`}
            />
          </div>
        </div>

        {/* Features section (three separate cards) */}
        <div className="mx-auto mt-8 max-w-[1440px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURE_CARDS.slice(0, 3).map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-6 pb-32 pt-40 md:pb-40">
          <ForExperts />
        </div>

        <FaqSection />
      </div>

      <Footer style={{ backgroundColor: "transparent", borderTop: "none" }} />

      <RequestTopicDialog
        isOpen={requestTopicDialog.isOpen}
        handleClose={requestTopicDialog.requestClose}
        onDirtyChange={requestTopicDialog.setDirty}
        handleSubmitClose={requestTopicDialog.notifySubmitted}
      />
      <WarningDialog
        open={requestTopicDialog.isWarningOpen}
        handleClose={requestTopicDialog.closeWarning}
        handleYesClick={requestTopicDialog.confirmDiscard}
      />
    </div>
  );
}

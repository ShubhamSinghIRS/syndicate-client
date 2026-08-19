import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import {
  TERMS_OF_USE_INTRO,
  TERMS_OF_USE_SECTIONS,
  TERMS_OF_USE_TITLE,
} from "../../home/constants/homeConstants";

export default function TermsOfUse() {
  return (
    <div className="bg-main-background min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {TERMS_OF_USE_TITLE}
          </h1>

          <div className="mt-8 flex flex-col gap-4">
            {TERMS_OF_USE_INTRO.map((paragraph, index) => (
              <p
                key={index}
                className="text-base text-text-secondary leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-8">
            {TERMS_OF_USE_SECTIONS.map((section) => (
              <div key={section.heading}>
                <h2 className="text-xl font-semibold text-text-primary">
                  {section.heading}
                </h2>
                <div className="mt-2 flex flex-col gap-3">
                  {section.body.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-base text-text-secondary leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

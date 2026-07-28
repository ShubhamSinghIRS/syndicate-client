type FooterProps = {
  style?: React.CSSProperties;
};

export default function Footer({ style }: FooterProps) {
  return (
    <footer
      className="bg-[#F8F6F3] dark:bg-section-background border-t border-[#E9E4DC] dark:border-gray-800"
      style={style}
    >
      <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between text-sm text-text-secondary">
        <span>© {new Date().getFullYear()} Infollion. On demand experts.</span>
      </div>
    </footer>
  );
}

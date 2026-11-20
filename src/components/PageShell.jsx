import Header from "./Header";
import Footer from "./Footer";

// Every normal page is wrapped in this: header on top, footer at the bottom.
// Pass footer={false} on pages that should not show the footer (like the account pages).
export default function PageShell({ children, footer = true }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-night">
      <Header />
      <main className="flex-1">{children}</main>
      {footer && <Footer />}
    </div>
  );
}
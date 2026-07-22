import { Component, type ReactNode } from "react";

interface State {
  error: Error | null;
}

/** Catches any runtime crash so the site never shows a blank page.
    Displays the error text so it can be reported and fixed. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("NatureCrafts crashed:", error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5 py-16">
        <div className="w-full max-w-lg rounded-2xl border border-moss-900/10 bg-white p-8 text-center shadow-lift">
          <p className="font-display text-2xl text-moss-900">
            Something slipped out of our hands
          </p>
          <p className="mt-3 font-body text-[15px] font-light text-moss-800/80">
            A small error occurred on this page. Tap below to reload — your
            cart is safe.
          </p>
          <pre className="mt-5 overflow-auto rounded-xl bg-moss-50 p-4 text-left font-mono text-[12px] leading-relaxed text-moss-800">
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <button
            className="btn-gold mt-6"
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
          >
            Reload the shop
          </button>
        </div>
      </div>
    );
  }
}

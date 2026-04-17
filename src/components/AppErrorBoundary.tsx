import React from 'react';

type AppErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Unexpected error';
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown) {
    // Keep the error in the console for debugging on production devices.
    console.error('VinzaTools crashed:', error);
  }

  componentDidMount() {
    const handleGlobalError = (event: ErrorEvent) => {
      if (this.state.hasError) return;
      this.setState({
        hasError: true,
        message: event.error?.message || event.message || 'Unexpected error',
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (this.state.hasError) return;
      const reason = event.reason;
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === 'string'
            ? reason
            : 'Unexpected async error';
      this.setState({ hasError: true, message });
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    (this as any)._vinzaCleanup = () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }

  componentWillUnmount() {
    (this as any)._vinzaCleanup?.();
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-[#0f0a0a] text-white">
        <div className="mx-auto flex max-w-2xl flex-col gap-5 px-6 py-16">
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8">
            <div className="text-xl font-black tracking-tight">Something went wrong</div>
            <p className="mt-3 text-sm leading-7 text-rose-100/75">
              A section of VinzaTools crashed while loading. Please refresh the page.
            </p>
            <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200/80">
              {this.state.message || 'Unknown error'}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="vinza-button cursor-pointer rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, message: '' })}
                className="vinza-button cursor-pointer rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


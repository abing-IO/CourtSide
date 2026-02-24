"use client";

import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Display Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white font-sans gap-4">
                    <div className="text-6xl mb-2">⚠️</div>
                    <div className="text-xl font-bold tracking-wider uppercase text-amber-400">Connection Lost</div>
                    <div className="text-sm text-gray-400 max-w-md text-center">
                        The scoreboard display encountered an error. Try refreshing the page.
                    </div>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false });
                            window.location.reload();
                        }}
                        className="mt-4 px-6 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg font-bold text-sm hover:bg-amber-500 hover:text-white transition-all"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

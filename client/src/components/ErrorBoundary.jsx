import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
                    <div className="max-w-2xl w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-red-500/30">
                        <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong.</h1>
                        <p className="text-gray-300 mb-6">
                            The application encountered an unexpected error. Please try refreshing the page.
                        </p>

                        {this.state.error && (
                            <div className="bg-black/50 rounded-lg p-4 mb-4 overflow-auto max-h-60 border border-gray-700">
                                <p className="font-mono text-red-400 text-sm break-words">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        {this.state.errorInfo && (
                            <details className="text-gray-400 text-sm">
                                <summary className="cursor-pointer hover:text-white transition-colors mb-2">
                                    Component Stack Trace
                                </summary>
                                <pre className="bg-black/50 p-4 rounded-lg overflow-auto max-h-60 font-mono text-xs text-gray-500">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors"
                            >
                                Reload Page
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-colors"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

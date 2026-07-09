import React from 'react';
import { RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[BaoxiangFlower Error]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      
      return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 p-8 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(212,175,55,0.05) 70%, transparent 100%)',
          }}>
            <span className="text-3xl">🌸</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-serif text-[#D4AF37] tracking-wider">万象暂歇 · 流光待续</h2>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              宝相花工坊遇到了一点小问题。这可能是由于浏览器兼容性或设备性能导致，请尝试刷新页面。
            </p>
            {this.state.error && (
              <p className="text-[10px] text-gray-600 font-mono mt-2 break-all">
                {this.state.error.message}
              </p>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="ios-btn-primary flex items-center gap-2 px-6"
          >
            <RefreshCw className="w-4 h-4" /> 重新尝试
          </button>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-gray-500 hover:text-[#D4AF37] underline transition-colors"
          >
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

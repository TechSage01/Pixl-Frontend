import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("UI crash:", error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <p style={{ padding: 16, color: "crimson", whiteSpace: "pre-wrap", fontSize: 13 }}>
          {String(this.state.error?.stack || this.state.error)}
        </p>
      );
    }
    return this.props.children;
  }
}
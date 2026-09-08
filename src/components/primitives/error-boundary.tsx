'use client'
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Alert } from './feedback.js'
import { Button } from './button.js'
export interface ErrorBoundaryProps {
  children: ReactNode
  /** Custom fallback. A function receives the error and a reset callback; omit for the default Alert. */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  onError?: (error: Error, info: ErrorInfo) => void
  heading?: string
  description?: string
}
interface ErrorBoundaryState {
  error: Error | null
}
/** Catches rendering errors in its subtree. Does not catch errors in event handlers, async code or its own render — put boundaries around independent sections, not once at the root. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }
  reset = () => this.setState({ error: null })
  render() {
    const { error } = this.state
    if (!error) return this.props.children
    if (typeof this.props.fallback === 'function') return this.props.fallback(error, this.reset)
    if (this.props.fallback !== undefined) return this.props.fallback
    return (
      <Alert heading={this.props.heading ?? 'Something went wrong'} tone="error">
        {this.props.description ?? 'Try again, or reload the page if the problem continues.'}
        <div className="cui-row">
          <Button onClick={this.reset}>Try again</Button>
        </div>
      </Alert>
    )
  }
}

import React, { Suspense, lazy } from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #64748b;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 0.875rem;
`;

const ErrorContainer = styled.div`
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 1.5rem;
  color: #991b1b;
`;

const ErrorTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.p`
  font-size: 0.875rem;
  line-height: 1.5;
`;

const ErrorDetails = styled.details`
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #7f1d1d;
`;

const Loading: React.FC = () => (
  <LoadingContainer>
    <Spinner />
    <LoadingText>Loading Finance Module...</LoadingText>
  </LoadingContainer>
);

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Failed to Load Finance Module</ErrorTitle>
          <ErrorMessage>
            The Finance microfrontend could not be loaded. Please ensure the remote
            application is running on http://localhost:3002.
          </ErrorMessage>
          <ErrorDetails>
            <summary>Error Details</summary>
            <pre>{this.state.error?.message}</pre>
          </ErrorDetails>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// Lazy load the remote Finance module
// @ts-expect-error - Remote module from Module Federation
const FinanceApp = lazy(() => import('finance/FinanceApp'));

export const FinancePage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <FinanceApp />
      </Suspense>
    </ErrorBoundary>
  );
};

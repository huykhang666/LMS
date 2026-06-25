import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useAuthListener } from '@/features/auth/hooks/useAuth';

export function Providers({ children }: { children: React.ReactNode }) {
  // Listen to Auth State globally
  useAuthListener();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

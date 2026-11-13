import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PassThrough } from 'node:stream';
import { AuthContext } from './Providers/AuthProvider';
import CommunityApp from './Community/Community';
export function render(url) {
  const cache = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const auth = { user: null, loading: false };
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    let html = '';
    output.on('data', (part) => {
      html += part.toString();
    });
    output.on('end', () => {
      cache.clear();
      resolve(html);
    });
    output.on('error', reject);
    const stream = renderToPipeableStream(
      <QueryClientProvider client={cache}>
        <AuthContext.Provider value={auth}>
          <HelmetProvider context={{}}>
            <StaticRouter location={url}>
              <CommunityApp />
            </StaticRouter>
          </HelmetProvider>
        </AuthContext.Provider>
      </QueryClientProvider>,
      {
        onAllReady() {
          stream.pipe(output);
        },
        onShellError: reject,
        onError: reject,
      },
    );
  });
}

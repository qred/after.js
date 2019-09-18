import { matchRoutes, MatchedRoute } from 'react-router-config';
import { AsyncRouteProps } from './types';
import { isLoadableComponent } from './utils';

/**
 * This helps us to make sure all the async code is loaded before rendering.
 */
export async function ensureReady(routes: AsyncRouteProps[], pathname?: string) {
  const matchedRoutes = matchRoutes(routes, pathname || window.location.pathname);
  await Promise.all(
    matchedRoutes.map((matches: MatchedRoute<{}>) => {
      const { route } = matches
      if (route.component && isLoadableComponent(route.component) && route.component.load) {
        return route.component.load();
      }
      return null
    })
  );

  let data;
  if (typeof window !== undefined && !!document) {
    // deserialize state from 'serialize-javascript' format
    data = eval('(' + (document as any).getElementById('server-app-state').textContent + ')');
  }
  return Promise.resolve(data);
}

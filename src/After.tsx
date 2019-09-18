import * as React from 'react';
import { withRouter, match as Match, RouteComponentProps } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { loadInitialProps } from './loadInitialProps';
import { History, Location } from 'history';
import { AsyncRouteProps } from './types';
import { get404Component } from "./utils"

export interface AfterpartyProps extends RouteComponentProps<any> {
  history: History;
  location: Location;
  data?: Promise<any>[];
  routes: AsyncRouteProps[];
  match: Match<any>;
}

export interface AfterpartyState {
  data?: Promise<any>[];
  previousLocation: Location | null;
}

const Afterparty = ({
  history,
  location,
  data: defaultData,
  match,
  routes,
  staticContext,
  ...rest
}: AfterpartyProps) => {
  const [prefetcherCache, setPrefetcherCache] = React.useState({});
  const [previousLocation, setPreviousLocation] = React.useState<Location | null>(null);
  const [data, setData] = React.useState<Promise<any>[] | undefined>(defaultData);
  const NotfoundComponent = React.useMemo(() => get404Component(routes), [routes]);

  const prefetch = (pathname: string) => {
    loadInitialProps(routes, pathname, {
      history: history
    })
      .then(({ data }) => {
        setPrefetcherCache({
          ...prefetcherCache,
          [pathname]: data
        });
      })
      .catch((e) => console.log(e));
  };

  React.useEffect(() => {
    // save the location so we can render the old screen
    setPreviousLocation(location);
    setData(undefined);

    // const { data, match, routes, history, location, staticContext, ...rest } = nextProps;

    loadInitialProps(routes, location.pathname, {
      location: location,
      history: history,
      ...rest
    })
      .then(({ data }) => {
        // Only for page changes, prevent scroll up for anchor links
        if (
          (previousLocation && previousLocation.pathname) !== location.pathname
        ) {
        window.scrollTo(0, 0);
        }
        setPreviousLocation(null);
        setData(data);
      })
      .catch((e) => {
        // @todo we should more cleverly handle errors???
        console.log(e);
      });
  }, [location]);

  const initialData = prefetcherCache[location.pathname] || data || {};

  if (initialData && initialData.statusCode && initialData.statusCode === 404) {
    routes.unshift({
      component: NotfoundComponent,
      path: location.pathname
    })
  }

  return renderRoutes(routes, {
    ...initialData,
    prefetch
  });
}

export const After = withRouter(Afterparty);

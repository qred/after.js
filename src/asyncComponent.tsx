import * as React from 'react';
import { Module, AsyncRouteComponentType, Ctx } from './types';

/**
 * Returns a new React component, ready to be instantiated.
 * Note the closure here protecting Component, and providing a unique
 * instance of Component to the static implementation of `load`.
 */
export function asyncComponent<Props>({
  loader,
  Placeholder
}: {
  loader: () => Promise<Module<React.ComponentType<Props>>>;
  Placeholder?: React.ComponentType<Props>;
}) {
  // keep Component in a closure to avoid doing this stuff more than once
  let Component: AsyncRouteComponentType | null = null;

  const AsyncRouteComponent: any = (props: Props) => {
    const [ComponentFromState, setComponent] = React.useState<AsyncRouteComponentType | null>(Component);

    const updateState = () => {
        if (ComponentFromState !== Component) {
          setComponent(Component)
        }
    }

    React.useEffect(() => {
      AsyncRouteComponent.load!().then(updateState)
    })

    if (ComponentFromState) {
      return <ComponentFromState {...props} />;
    }

    if (Placeholder) {
      return <Placeholder {...props} />;
    }

    return null;
  }

  AsyncRouteComponent.load = async () => {
    const ResolvedComponent = await loader();
    Component = ResolvedComponent!.default || ResolvedComponent;
    return Component;
  };

  AsyncRouteComponent.getInitialProps = (ctx: Ctx<any>) => {
    // Need to call the wrapped components getInitialProps if it exists
    if (Component !== null) {
      return Component.getInitialProps ? Component.getInitialProps(ctx) : Promise.resolve(null);
    }
  }

  return AsyncRouteComponent;
}

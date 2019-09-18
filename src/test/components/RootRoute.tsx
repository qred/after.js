import React from 'react';

class RootRoute extends React.Component {
  static displayName = 'Assessments';

  static async getInitialProps() {
    return { stuff: 'root route' };
  }

  render() {
    return (
      <h1>RootRoute</h1>
    );
  }
}

export default RootRoute;

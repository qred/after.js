import React from 'react';

class NestedRoute extends React.Component {
  static displayName = 'Assessments';

  static async getInitialProps() {
    return { sub: 'nested route' };
  }

  render() {
    return (
      <h1>NestedRoute</h1>
    );
  }
}

export default NestedRoute;

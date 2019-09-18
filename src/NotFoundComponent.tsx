import React from 'react';
import { Route } from "react-router-dom";

const NotFound: any = () => {
	return (
		<Route
			render={({ staticContext }) => {
				if (staticContext) staticContext.statusCode = 404;
				return <div>The Page You Were Looking For Was Not Found</div>;
			}}
		/>
	)
};

// just for test purpose
NotFound.data = `The Page You Were Looking For Was Not Found`;

export default NotFound;

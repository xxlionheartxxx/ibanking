import React from 'react';
import { Route, Redirect } from 'react-router-dom'
// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function HomeIfLoginRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !localStorage.getItem('37ibanking.accessToken.customer') ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/Home",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default HomeIfLoginRoute;

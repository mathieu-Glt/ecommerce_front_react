import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useUser } from "../Context/userContext";

function ProtectedRoute({
  component: Component,
  redirectTo = "/login",
  ...rest
}) {
  const { user, loading } = useUser();
  // console.log("rest: ", rest);
  console.log("user: ", user);

  return (
    <Route
      {...rest}
      // render role of the user to access the page
      render={({ location, ...routeProps }) => {
        if (loading) return null;
        // console.log("location: ", location);
        // console.log("routeProps: ", routeProps);
        if (!user) {
          return (
            <Navigate
              to={{ pathname: redirectTo, state: { from: location } }}
            />
          );
        }
        return <Component {...routeProps} />;
      }}
    />
  );
}

export default ProtectedRoute;

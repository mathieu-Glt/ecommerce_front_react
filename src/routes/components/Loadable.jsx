// src/components/Loadable.js
import React, { Suspense } from "react";
import Loader from "./Loader";

export default function Loadable(Component) {
  return function LoadableComponent(props) {
    return (
      <Suspense fallback={<Loader />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

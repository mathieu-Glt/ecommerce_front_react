import React from "react";
import { useSelector } from "react-redux";

function ReduxDebug() {
  const state = useSelector((state) => state);

  return (
    <div className="container mt-4">
      <h3>🔍 Redux State Debug</h3>
      <div className="row">
        <div className="col-md-6">
          <h5>User State:</h5>
          <pre className="bg-light p-2 rounded">
            {JSON.stringify(state.user, null, 2)}
          </pre>
        </div>
        <div className="col-md-6">
          <h5>Category State:</h5>
          <pre className="bg-light p-2 rounded">
            {JSON.stringify(state.category, null, 2)}
          </pre>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-6">
          <h5>ManageUser State:</h5>
          <pre className="bg-light p-2 rounded">
            {JSON.stringify(state.manageUser, null, 2)}
          </pre>
        </div>
        <div className="col-md-6">
          <h5>Complete State:</h5>
          <pre className="bg-light p-2 rounded" style={{ fontSize: "10px" }}>
            {JSON.stringify(state, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default ReduxDebug;








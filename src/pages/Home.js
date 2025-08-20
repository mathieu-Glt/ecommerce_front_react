import React from "react";

function Home() {
  return (
    <div>
      <h1>
        Welcome to Our E-commerce{" "}
        {window.localStorage.getItem("emailForRegistration")
          ? window.localStorage
              .getItem("emailForRegistration")
              .replace(".gillet@hotmail.fr", "")
          : "Site"}
        !
      </h1>
      <p>Welcome to the home page!</p>
    </div>
  );
}

export default Home;

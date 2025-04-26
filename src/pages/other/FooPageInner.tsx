import React from "react";
import { Link } from "react-router-dom";

const FrankPageInner: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Foo's Inner Page</h1>
      <p>This is a sample page created for demonstration purposes.</p>
      <Link to="#" onClick={() => window.history.back()}>
        Go Back
      </Link>
    </div>
  );
};

export default FrankPageInner;

import React from "react";
import { Link } from "react-router-dom";

const FrankPage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Foo's Page</h1>
      <p>This is a sample page created for demonstration purposes.</p>

      <p>
        {/* <Link to={`${window.location.pathname}/inner`}>Go to inner</Link> */}
        <Link to={`inner`}>Go to inner</Link>
      </p>

      <a href="#" onClick={() => window.history.back()}>
        Go Back
      </a>
    </div>
  );
};

export default FrankPage;

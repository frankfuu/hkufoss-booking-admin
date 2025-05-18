import React from "react";
import { Link } from "react-router-dom";
const BASE_PATH = import.meta.env.VITE_BASE_PATH;
const API_URL = import.meta.env.VITE_API_URL;
const VITE_PROJECT_NAME = import.meta.env.VITE_PROJECT_NAME;
const VITE_FOO = import.meta.env.VITE_FOO;

const FrankPage: React.FC = () => {
  return (
    <div>
      <p>BASE_PATH : {BASE_PATH}</p>
      <p>API_URL : {API_URL}</p>
      <p>VITE_PROJECT_NAME : {VITE_PROJECT_NAME}</p>
      <p>VITE_FOO : {VITE_FOO}</p>
      
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

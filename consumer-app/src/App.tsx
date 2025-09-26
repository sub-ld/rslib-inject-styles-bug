import React from "react";
import { foo } from "../../dist/index.js";

function App() {
  console.log({ foo });
  return (
    <div style={{ padding: "20px" }}>
      <h1>rslib injectStyles Bug Test</h1>
      <p>Minimal reproduction of module.id error with injectStyles: true</p>
      <p>✅ If you see this, no error occurred</p>
    </div>
  );
}

export default App;

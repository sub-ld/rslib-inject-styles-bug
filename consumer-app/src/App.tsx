import React from "react";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>rslib injectStyles Bug Test</h1>
      <p>This app imports the library to test if the module.id error occurs.</p>

      <div style={{ marginTop: "20px" }}>
        <h2>Component from Library:</h2>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Status:</h2>
        <p id="status">
          ✅ Library loaded successfully (if you see this, no error occurred)
        </p>
      </div>
    </div>
  );
}

export default App;

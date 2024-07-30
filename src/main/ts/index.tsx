import React from "react";
import { createRoot } from "react-dom/client";
import { DbProvider } from "./dbContext";
import { App } from "./app";

const container = document.getElementById("root");

// Show some information about the state of storage
Promise.resolve().then(async () => {
  const dir = await navigator.storage.getDirectory();

  console.log(await navigator.storage.estimate());
  for await (const entry of dir.entries()) {
    console.log(entry);
  }
});

if (container) {
  const root = createRoot(container);
  root.render(
    <DbProvider>
      <App />
    </DbProvider>,
  );
}

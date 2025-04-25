import { createRoot } from "react-dom/client";
import { App } from "./view/root";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Missing root");
}

const root = createRoot(container);
root.render(<App />);

import { createRoot } from "react-dom/client";
import "lenis/dist/lenis.css";
import "../index.css";
import { V2App } from "./V2App";

createRoot(document.getElementById("root")!).render(<V2App />);

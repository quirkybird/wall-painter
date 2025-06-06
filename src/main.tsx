import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/view/app/App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

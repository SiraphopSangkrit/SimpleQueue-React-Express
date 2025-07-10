import { createBrowserRouter } from "react-router";
import MainLayout from "./layout/MainLayout";
import { Home } from "./pages/Home";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <div>Not Found</div>,
    children: [{
        index: true,
        element: <Home />
    }],
  },
]);
export default router;

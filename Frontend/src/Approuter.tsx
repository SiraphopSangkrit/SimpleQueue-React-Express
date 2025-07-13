import { createBrowserRouter } from "react-router";
import MainLayout from "./layout/MainLayout";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/404";
import { Booking } from "./pages/Booking";
import { Customer } from "./pages/Customer";
import UserLayout from "./layout/UserLayout";
import { UserBooking } from "./pages/Users/UserBooking";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "bookings",
        element: <Booking />,
      },
      {
        path: "customers",
        element: <Customer />,
      },
    ],
  },
  {
    path: "/users",
    element: <UserLayout />,
    errorElement: <NotFound />,
    children: [
      {
       path: "bookings",
        element: <UserBooking />,
      },
    ],
  },
]);
export default router;

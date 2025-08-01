import { createBrowserRouter } from "react-router";
import AdminLayout from "./layout/AdminLayout";
import { Home } from "./pages/Admin/Home";
import { NotFound } from "./pages/404";
import { Booking } from "./pages/Admin/Booking";
import { Customer } from "./pages/Admin/Customer";
import UserLayout from "./layout/UserLayout";
import { UserBooking } from "./pages/Users/UserBooking";
import  {General} from "./pages/Admin/Settings/General";
import { BookingSuccess } from "./pages/Users/QueueSuccess";
const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout/>,
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
      {
        path:"settings/general",
        element: <General />,
      }
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
      {
        path: "booking-confirmation/:bookingId",
        element: <BookingSuccess />,
      }
    ],
  },
]);
export default router;

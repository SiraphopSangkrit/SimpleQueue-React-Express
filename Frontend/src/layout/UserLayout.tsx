import { Outlet } from "react-router";
import { ThemeToggle } from "../components/ThemeController";


export default function UserLayout() {
    return (
        <div className="flex flex-col min-h-screen">
        <header className="bg-base-100 text-white p-4 shadow-md text-right">
            <ThemeToggle/>
        </header>
        <main className="flex-grow p-4 bg-base-200">
            <Outlet />
        </main>
       
        </div>
    );
}
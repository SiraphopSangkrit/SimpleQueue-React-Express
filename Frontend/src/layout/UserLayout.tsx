import { Outlet } from "react-router";
import { ThemeToggle } from "../components/ThemeController";


export default function UserLayout() {
    return (
        <div className="flex flex-col min-h-screen">
        <header className="bg-base-300 text-white p-4 shadow-md text-right">
            <ThemeToggle/>
        </header>
        <main className="flex-grow p-4">
            <Outlet />
        </main>
       
        </div>
    );
}
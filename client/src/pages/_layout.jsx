// src/pages/_layout.jsx
import { Header, SideBar, BottomBar } from "../components/navigation";
import Toast from "../components/toast";

export default function PageLayout({ children }) {

    return (
        <div className="grid h-screen w-screen grid-rows-[auto_1fr_auto] overflow-hidden">

            <Toast />

            {/* Header */}
            <Header />

            {/* Main section */}
            <div className="grid grid-cols-12 min-h-0">

                {/* Sidebar */}
                <aside className="hidden md:flex col-span-1 lg:col-span-2">
                    <SideBar />
                </aside>

                {/* ✅ SCROLL CONTAINER */}
                <main className="
                    col-span-12 md:col-span-11 lg:col-span-10
                    min-h-0 overflow-y-auto
                ">
                    {children}
                </main>
            </div>

            {/* Bottom navigation (mobile) */}
            <div className="md:hidden h-14">
                <BottomBar />
            </div>

        </div>
    );
}

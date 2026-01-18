// src/components/navigation/bottomBar.jsx
import { HomeIcon, SearchIcon, PlusIcon, ReelsIcon, ProfileIcon } from "../../assets/icons";
import { NavLink } from "react-router-dom";

export default function BottomBar() {
    const tabs = [
        { link: "/home", label: "Home", icon: HomeIcon },
        { link: "/explore", label: "Explore", icon: SearchIcon },
        { link: "/create", label: "Create", icon: PlusIcon },
        { link: "/reels", label: "Reels", icon: ReelsIcon },
        { link: "/profile", label: "Profile", icon: ProfileIcon },
    ];

    return (
        <footer className="w-full h-14 flex items-center justify-around bg-surface">
            {tabs.map((tab) => (
                <NavLink
                    to={tab.link}
                    end={tab.link === "/"}
                    key={tab.label}
                    className={({ isActive }) =>
                        `
                        flex flex-col items-center justify-center 
                        gap-1 px-4 py-2 transition-all
                        ${isActive ? "text-accent" : "text-subtext hover:text-accent"}
                        `
                    }
                >
                    <tab.icon className="text-2xl" />
                </NavLink>
            ))}
        </footer>
    );
}
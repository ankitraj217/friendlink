// src/components/navigation/headerBar.jsx
import { NavLink, useLocation } from "react-router-dom";
import { NotificationsIcon, SettingsIcon } from "../../assets/icons";

export default function HeaderBar() {
    const { pathname } = useLocation();

    // Map routes → Titles
    const titles = {
        "/": "FriendLink",
        "/reels": "Reels",
        "/explore": "Explore",
        "/profile": "Profile",
        "/messages": "Messages",
        "/settings": "Settings",
        "/create": "Create Moment",
        "/notifications": "Notifications",
    };

    // Fallback for dynamic routes like /profile/123
    const currentTitle = titles[pathname] || "FriendLink";

    return (
        <header
            className="h-14 w-full flex items-center justify-between px-4 py-3 bg-surface">
            <h1 className="text-xl font-semibold tracking-wide">
                {currentTitle === "FriendLink" ? (
                    <><span className="text-text">Friend</span><span className="text-accent">Link</span></>
                ) : (
                    currentTitle
                )}
            </h1>

            <div className="flex h-full items-center gap-2">
                <NavLink to={'/notifications'}
                    className={({ isActive }) => `flex items-center justify-center w-6 h-6 ${isActive ? "text-accent" : "text-subtext"}`}
                >
                    <NotificationsIcon className="text-xl" />
                </NavLink>
                <NavLink to={'/settings'}
                    className={({ isActive }) => `flex items-center justify-center w-6 h-6 ${isActive ? "text-accent" : "text-subtext"}`}
                >
                    <SettingsIcon className="text-xl" />
                </NavLink>
            </div>
        </header>
    );
}

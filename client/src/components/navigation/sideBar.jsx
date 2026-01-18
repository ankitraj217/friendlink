/// src/components/navigation/sideBar.jsx
import {
    HomeIcon, SearchIcon, PlusIcon, ReelsIcon,
    ProfileIcon, MessagesIcon, NotificationsIcon, SettingsIcon
} from "../../assets/icons";
import { NavLink } from "react-router-dom";

export default function SideBar() {

    const tabs = [
        { link: '/home', label: 'Home', icon: <HomeIcon /> },
        { link: '/explore', label: 'Explore', icon: <SearchIcon /> },
        { link: '/create', label: 'Create', icon: <PlusIcon /> },
        { link: '/reels', label: 'Reels', icon: <ReelsIcon /> },
        { link: '/message', label: 'Message', icon: <MessagesIcon /> },
        { link: '/notifications', label: 'Notifications', icon: <NotificationsIcon /> },
        { link: '/profile', label: 'Profile', icon: <ProfileIcon /> },
        { link: '/settings', label: 'Settings', icon: <SettingsIcon /> },
    ];

    return (
        <aside className="flex flex-col w-full bg-surface p-4 gap-4">
            {tabs.map((tab) => (
                <NavLink
                    key={tab.label}
                    to={tab.link}
                    end={tab.link === "/"}
                    className={({ isActive }) =>
                        `
                        flex items-center gap-3 px-3 py-2 rounded-lg
                        text-sm font-medium transition-all
                        
                        ${isActive
                            ? "text-accent bg-background"
                            : "text-subtext hover:bg-background hover:text-accent"
                        }
                        `
                    }
                >
                    <span className="text-xl">{tab.icon}</span>

                    <span className="hidden lg:block">
                        {tab.label}
                    </span>
                </NavLink>
            ))}
        </aside>
    );
}

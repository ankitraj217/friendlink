// src/pages/settings/index.jsx
import PageLayout from "../_layout";
import ThemeToggler from "../../components/themeToggler";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../contexts";

function SettingItem({ title, description, action }) {
    return (
        <div className="flex flex-col w-full gap-1 max-w-2xl border-b border-surface pb-3">
            <h3 className="font-semibold text-base">{title}</h3>
            <div className="flex items-center gap-2">
                <p className="text-sm text-subtext max-w-[75%]">
                    {description}
                </p>
                <div className="ml-auto">
                    {action}
                </div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const { authLogOut } = useAuthContext();

    return (
        <PageLayout>
            <div className="flex flex-col w-full items-center gap-4 p-4">

                <SettingItem
                    title="Profile"
                    description="View and update your personal profile details."
                    action={
                        <NavLink
                            to="/settings/profile"
                            className="text-sm text-accent hover:underline"
                        >
                            Manage
                        </NavLink>
                    }
                />

                <SettingItem
                    title="Theme"
                    description="Switch between light and dark mode to suit your preference."
                    action={<ThemeToggler />}
                />

                <SettingItem
                    title="Notifications"
                    description="Manage how and when you receive notifications."
                    action={
                        <NavLink
                            to="/settings/notifications"
                            className="text-sm text-accent hover:underline"
                        >
                            Control
                        </NavLink>
                    }
                />

                <SettingItem
                    title="Logout"
                    description="Sign out securely from your account on this device."
                    action={
                        <button
                            className="text-sm text-red-500 hover:text-red-600 font-medium cursor-pointer"
                            onClick={() => {
                                authLogOut(); // Log out 
                            }}
                        >
                            Log out
                        </button>
                    }
                />

            </div>
        </PageLayout>
    );
}
// src/components/ThemeToggler.jsx
import { useThemeContext } from '../contexts';
import { LightIcon, DarkIon } from '../assets/icons';

export default function ThemeToggler() {
    const { theme, toggleTheme } = useThemeContext();
    const isDark = theme === 'dark';

    return (
        <label
            className="ml-auto relative inline-block w-20 h-8 cursor-pointer select-none"
            title="Toggle Theme"
        >
            <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
                className="sr-only peer"
                aria-label="Toggle dark mode"
            />

            {/* Track */}
            <div className="w-full h-full bg-surface rounded-full px-2 flex text-[11px] font-medium text-subtext overflow-hidden">
                <div
                    className={`w-1/2 h-full flex items-center justify-center transition-all duration-300 ${isDark ? '' : 'ml-auto'
                        }`}
                >
                    {isDark ? 'Dark' : 'Light'}
                </div>
            </div>

            {/* Thumb */}
            <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-border shadow-md flex items-center justify-center transition-transform duration-300 peer-checked:translate-x-12">
                {isDark ? <DarkIon size={16} className="text-accent" /> : <LightIcon size={16} className="text-primary" />}
            </div>
        </label>
    );
}

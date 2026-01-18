// src/pages/404.jsx
import { NavLink } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="flex flex-col h-screen justify-center items-center p-4">
            <img src="/404page.png" alt="404 Error" className="size-80" />

            <NavLink to={'/'} className='btn btn-primary'>
                Go Home
            </NavLink>

        </div>
    )
}


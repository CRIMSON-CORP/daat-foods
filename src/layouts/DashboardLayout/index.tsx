import { adminDashboardNavLinks } from '@/config/app-config';
import { initializeAdmin } from '@/redux/admin/actions';
import { RootState } from '@/redux/store';
import { closeSideBar, openSideBar } from '@/redux/uiReducer/actions';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function DashboardLayout({ children }: { children: React.ReactElement }) {
    return (
        <div className="h-screen">
            <main className="relative text-white min-h-screen flex">
                <Sidebar />
                <section className="container h-screen min-h-screen flex-grow flex flex-col w-full pb-5">
                    <NavBar />
                    <section
                        id="main"
                        className="lg:px-8 md:px-6 sm:px-4 px-3 h-full md:pb-0 pb-7 max-h-full bg-primary-100/10 rounded-3xl overflow-auto"
                    >
                        {children}
                    </section>
                </section>
            </main>
        </div>
    );
}

export default DashboardLayout;

const DashboardNavItem: React.FC<{
    iconPath: string;
    active: boolean;
    label: string;
    url: string;
}> = ({ iconPath, label, url, active }) => {
    return (
        <li className="relative isolate px-10">
            <Link
                href={url}
                className={`relative flex items-center gap-3.5 py-3 px-5 w-full ${
                    active ? 'text-primary-800' : 'text-slate-600'
                }`}
            >
                <Image
                    alt={label}
                    src={iconPath}
                    width={52}
                    height={52}
                    className={`w-8 h-8 object-center object-contain ${
                        active ? 'invert-[0.8]' : 'invert-[0.4]'
                    }`}
                />
                <span className="font-semibold">{label}</span>
                {active && (
                    <span className="absolute -z-10 h-full w-full inset-0 rounded-md bg-primary-100/20" />
                )}
            </Link>
            {active && (
                <span className="absolute top-0 left-0 -z-10 h-full w-1.5 bg-primary-100" />
            )}
        </li>
    );
};

const Sidebar = () => {
    const dispatch = useDispatch();
    const sideBarOpen = useSelector((state: RootState) => state.ui.sideBarOpen);
    const onClick = () => {
        dispatch(closeSideBar());
    };
    const { pathname } = useRouter();

    useEffect(() => {
        dispatch(closeSideBar());
    }, [dispatch, pathname]);

    return (
        <nav
            className={`bg-white fixed md:sticky top-0 left-0 bottom-0 h-screen flex-none flex flex-col gap-10 w-full transition-all max-w-fit z-10 md:!translate-x-0 md:!opacity-100 ${
                sideBarOpen
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-full opacity-50'
            }`}
        >
            <Link href="/" className="max-w-[174px] m-12 mt-10">
                <Image
                    width={66}
                    height={113}
                    src="/daat_logo.png"
                    alt="daat foods logo"
                />
            </Link>
            <button
                onClick={onClick}
                className="md:opacity-0 md:pointer-events-none absolute top-8 right-8"
            >
                <Image
                    width={24}
                    height={24}
                    src="/close.svg"
                    alt="close side bar"
                    className="invert-[0.7]"
                />
            </button>

            <ul className="grid gap-8 list-none">
                {adminDashboardNavLinks.map((link, index) => (
                    <DashboardNavItem
                        key={index}
                        {...link}
                        active={link.urlMatch.includes(pathname.split('/')[2])}
                    />
                ))}
            </ul>
        </nav>
    );
};

const NavBar = () => {
    const dispatch = useDispatch();
    const session = useSession();

    const { data } = session;

    useEffect(() => {
        dispatch(initializeAdmin());
    }, [dispatch]);

    return (
        <header className="md:py-4 py-3  w-full z-[5] sticky top-0 left-0 flex justify-between gap-6 text-slate-600">
            <OpenSidebarButton />
            <div className="flex gap-6 justify-self-end">
                <div className="flex justify-between items-center gap-2">
                    <div className="aspect-square p-2 rounded-full bg-slate-200 overflow-hidden">
                        <Image
                            width={24}
                            height={24}
                            src={data?.user?.image || '/user.svg'}
                            alt={data?.user?.name || 'user'}
                            className="object-cover object-center"
                        />
                    </div>
                    <span className="font-semibold hidden md:inline-block">
                        {data?.user?.name ?? data?.user?.email}
                    </span>
                </div>
                <Logout />
            </div>
        </header>
    );
};

function Logout() {
    const logout = async () => {
        signOut({
            callbackUrl: `/login`,
        });
    };
    return (
        <button
            onClick={logout}
            className="flex gap-1 items-center p-2 rounded-lg bg-red-100 clickable"
        >
            <Image width={24} height={24} src="/logout.svg" alt="logout" />
            <span className="text-[#EE1A1A]">Logout</span>
        </button>
    );
}

function OpenSidebarButton() {
    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(openSideBar());
    };
    return (
        <button
            onClick={onClick}
            className="md:opacity-0 md:pointer-events-none"
        >
            <Image
                width={24}
                height={24}
                src="/menu.svg"
                alt="open side bar"
                className="invert-[0.7]"
            />
        </button>
    );
}

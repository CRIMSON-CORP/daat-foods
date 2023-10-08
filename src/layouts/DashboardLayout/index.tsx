import { adminDashboardNavLinks } from '@/config/app-config';
import axios from '@/lib/axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

function DashboardLayout({
    children,
    pageProps,
}: {
    children: React.ReactElement;
    pageProps: any;
}) {
    const { pathname } = useRouter();

    return (
        <div className="h-screen">
            <main className="relative text-white min-h-screen flex">
                <nav className="sticky top-0 left-0 bottom-0 h-screen flex flex-col gap-10 w-full max-w-[290px]">
                    <Link href="/" className="max-w-[174px] m-12 mt-10">
                        <Image
                            width={66}
                            height={113}
                            src="/daat_logo.png"
                            alt="daat foods logo"
                        />
                    </Link>
                    <ul className="grid gap-8 list-none">
                        {adminDashboardNavLinks.map((link, index) => (
                            <DashboardNavItem
                                key={index}
                                {...link}
                                active={pathname === link.url}
                            />
                        ))}
                    </ul>
                </nav>
                <section className="container h-screen min-h-screen flex-grow flex flex-col w-full pb-5">
                    <NavBar pageProps={pageProps} />
                    <section
                        id="main"
                        className="lg:px-8 md:px-6 sm:px-4 px-3 h-full md:pb-0 pb-20 max-h-full bg-primary-100/10 rounded-3xl overflow-auto"
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
        <li className="relative mr-10 isolate px-10">
            <Link
                href={url}
                className={`relative flex items-center gap-6 py-3 px-3 w-full ${
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
                <span className="absolute top-0 left-0 -z-10 h-full w-2 bg-primary-100" />
            )}
        </li>
    );
};

const NavBar = ({ pageProps }: { pageProps: any }) => {
    const { current_user } = pageProps;
    return (
        <header className="md:py-4 py-3  w-full z-[5] sticky top-0 left-0 flex justify-end gap-6 text-slate-600">
            <div className="flex justify-between items-center gap-2">
                <div className="aspect-square p-2 rounded-full bg-slate-200 overflow-hidden">
                    <Image
                        width={24}
                        height={24}
                        src={current_user.image ?? '/user.svg'}
                        alt={current_user.name ?? 'user'}
                        className="object-cover object-center"
                    />
                </div>
                <span className="font-semibold ">
                    {current_user.name ?? current_user.email}
                </span>
            </div>
            <Logout />
        </header>
    );
};

function Logout() {
    const { push } = useRouter();
    const logout = async () => {
        await axios.post('/admin/sign-out');
        await push('/admin/login');
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

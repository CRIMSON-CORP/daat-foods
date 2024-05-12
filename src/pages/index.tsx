import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import CartView from '@/components/CartView';
import HeaderCart from '@/components/HeaderCart';
import ProductItem from '@/components/ProductItem';
import useToggle from '@/hooks/useToggle';
import axios from '@/lib/axios';
import { getProducts } from '@/service/firebase';
import Head from 'next/head';

export default function Home({ products }: { products: ProductItem[] }) {
    return (
        <div className="bg-gray-200/50">
            <Head>
                <title>Buy your Favourite food stuffs | Daat Foods</title>
            </Head>
            <div className="flex flex-col min-h-[65vh] mb-10">
                <Header />
                <Hero />
            </div>
            <Shop products={products} />
            <Contact />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const products = await getProducts();
    return {
        props: { products },
    };
};

function Header() {
    const {
        state: toggleMenuState,
        toggle: toggleMenu,
        close: closeMenu,
    } = useToggle();

    const {
        state: scrollState,
        open: openScrollState,
        close: closeScrollState,
    } = useToggle();

    const {
        state: cartView,
        open: openCartView,
        close: closeCartView,
    } = useToggle();

    useEffect(() => {
        const handleScrollSateChange = () => {
            if (window.scrollY >= 200) openScrollState();
            else closeScrollState();
        };

        window.addEventListener('scroll', handleScrollSateChange);

        return () => {
            window.removeEventListener('scroll', handleScrollSateChange);
        };
    }, [
        closeCartView,
        closeMenu,
        closeScrollState,
        openScrollState,
        toggleMenu,
    ]);

    return (
        <header
            className={`py-6 top-0 w-full left-0 z-10 text-white border-b border-white/10 ${
                scrollState ? 'bg-black/30 fixed backdrop-blur-xl' : 'absolute'
            }`}
        >
            <div className="container relative flex items-center justify-between gap-5">
                <div className="">
                    <Link
                        href="/"
                        className="inline-block w-full max-w-[32px] md:max-w-[55px]"
                    >
                        <Image
                            width={55}
                            height={97.39}
                            src="/logo-white.png"
                            alt="daat foods logo"
                        />
                    </Link>
                </div>
                <nav className="absolute md:relative top-full right-5">
                    <ul
                        className={`uppercase tracking-wide flex flex-col md:flex-row gap-3 md:items-center p-4 rounded-xl border-2 border-white/10 ${
                            scrollState ? 'bg-black/30' : 'bg-white/15'
                        } backdrop-blur-lg translate-y-5 md:translate-y-0 md:!block ${
                            toggleMenuState ? 'block' : 'hidden'
                        }`}
                    >
                        <Link
                            href="/"
                            onClick={closeMenu}
                            className="px-3 py-2"
                        >
                            Home
                        </Link>
                        <Link
                            href="#shop"
                            onClick={closeMenu}
                            className="px-3 py-2"
                        >
                            Shop
                        </Link>
                        <Link
                            href="#contact"
                            onClick={closeMenu}
                            className="px-3 py-2"
                        >
                            Contact
                        </Link>
                    </ul>
                </nav>
                <div className="flex items-center gap-4">
                    <HeaderCart openCartView={openCartView} />
                    <button
                        onClick={toggleMenu}
                        className="md:hidden rounded-full"
                    >
                        <Image
                            width={32}
                            height={32}
                            src="/menu.svg"
                            alt="menu"
                        />
                    </button>
                </div>
            </div>
            {cartView && <CartView closeCartView={closeCartView} />}
        </header>
    );
}

function Hero() {
    return (
        <section id="hero" className="relative grow flex items-stretch isolate">
            <Image
                alt="hero image"
                height={700}
                width={962.5}
                src="/hero-image.webp"
                className="hero-background absolute inset-0 top-0 right-0 w-full h-full object-cover object-center brightness-[0.65] -z-10"
            />
            <div className="container overflow-hidden grow rounded relative isolate flex items-center justify-center">
                <div className="flex flex-col gap-6 items-center text-white max-w-6xl text-center">
                    <h3 className="uppercase text-xs md:text-sm">daat foods</h3>
                    <h1 className="font-bold text-3xl md:text-6xl tracking-wide !leading-snug">
                        Your One-Stop Foodstuff shop: Quality and Affordable
                        Food Delivered Right to You!
                    </h1>
                </div>
            </div>
            <Link
                href="#shop"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-10 py-3 rounded-full font-semibold bg-primary-100 text-primary-800 shadow-lg"
            >
                Shop now
            </Link>
        </section>
    );
}

function Shop({ products }: { products: ProductItem[] }) {
    return (
        <section id="shop" className="flex flex-col gap-16 py-16 scroll-mt-28">
            <header className="flex justify-center">
                <h2 className="uppercase text-center text-slate-700 text-2xl relative before:block before:absolute before:w-3/5 before:h-1 before:bg-slate-700 before:bottom-0 before:left-1/2 before:-translate-x-1/2 pb-10">
                    shop
                </h2>
            </header>
            <div className="container grid grid-cols-[repeat(auto-fit,minmax(320px,320px))] gap-7 justify-center">
                {products.map((product) => (
                    <ProductItem key={product.id} {...product} />
                ))}
            </div>
        </section>
    );
}

function Contact() {
    const onFormSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const email = formData.get('email') as string;
        const name = formData.get('name') as string;
        const message = formData.get('message') as string;

        try {
            form.classList.add('sending');
            const { data } = await axios.post('/email/contact', {
                email,
                name,
                message,
            });
            alert(data.message);
        } catch (error: any) {
            alert(error.response.data.message);
        } finally {
            form.classList.remove('sending');
        }
    };
    return (
        <section id="contact" className="relative min-h-screen grid">
            <Image
                height={700}
                width={962.5}
                alt="contact image"
                src="/hero-image.jpg"
                className="w-full h-full inset-0 -z-10 absolute brightness-[0.4] object-cover object-center"
            />
            <div className="container h-full grid grid-cols-1 md:grid-cols-2 text-white gap-16 items-stretch">
                <div className="grow w-full flex flex-col justify-center gap-16 py-16">
                    <header className="flex flex-col gap-5">
                        <h2 className="text-5xl font-bold">
                            You can reach us from anywhere!
                        </h2>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Voluptate, dolore perspiciatis. Expedita magni
                            praesentium cumque!
                        </p>
                    </header>
                    <ul className="flex flex-col text-lg font-medium gap-12">
                        <li className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-full p-3 border border-gray-300/50 backdrop-blur-xl">
                                <Image
                                    alt="mail"
                                    width={48}
                                    height={48}
                                    src="/mail-open.svg"
                                    className="text-white h-5"
                                />
                            </div>
                            <a href="mailto:daatfoods@gmail.com">
                                daatfoods@gmail.com
                            </a>
                        </li>
                        <li className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-full p-3 border border-gray-300/50 backdrop-blur-xl">
                                <Image
                                    alt="mail"
                                    width={24}
                                    height={45}
                                    src="/phone.svg"
                                    className="text-white h-5"
                                />
                            </div>
                            <a href="tel:0802656456232">0802656456232</a>
                        </li>
                        <li className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-full p-3 border border-gray-300/50 backdrop-blur-xl">
                                <Image
                                    alt="mail"
                                    width={384}
                                    height={512}
                                    src="/location-marker.svg"
                                    className="text-white h-5"
                                />
                            </div>
                            <a href="mailto:daatfoods@gmail.com">
                                No 4, Jeminat Street, Agbowo Express
                            </a>
                        </li>
                    </ul>
                    <footer>
                        <h3 className="text-lg font-semibold">Our Socials</h3>
                        <div className="flex flex-wrap gap-5 underline text-base text-slate-200 max-w-xs">
                            <a href="">Twitter</a>
                            <a href="https://www.facebook.com/profile.php?id=100078439475947&mibextid=ZbWKwL">
                                Facebook
                            </a>
                            <a href="https://www.instagram.com/daatfoods?igsh=MTJqcHI3MnJvdHZycg==">
                                Instagram
                            </a>
                            <a href="https://wa.me/message/HHNC5ARAPKF7E1">
                                Whatsapp
                            </a>
                            <a href="">Linkedin</a>
                        </div>
                    </footer>
                </div>
                <div className="grow w-full flex flex-col justify-center px-4 md:px-10 gap-16 border-l border-r border-white/10 bg-white/10 backdrop-blur-xl text-white py-16">
                    <h2 className="text-2xl font-bold">Contact Us!</h2>
                    <form
                        onSubmit={onFormSubmit}
                        className="flex flex-col gap-10 group"
                    >
                        <div className="flex flex-col gap-4">
                            <label htmlFor="name" className="font-semibold">
                                Your Name*
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                autoComplete="on"
                                className="border-b border-white bg-transparent w-full px-6 py-4 outline-none text-lg"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="email" className="font-semibold">
                                Your Email Address*
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="on"
                                required
                                className="border-b border-white bg-transparent w-full px-6 py-4 outline-none text-lg"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="message" className="font-semibold">
                                Message*
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                className="border-b border-white bg-transparent w-full px-6 py-4 outline-none text-lg min-h-[100px]"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="group-[.sending]:pointer-events-none group-[.sending]:opacity-50 clickable w-full inline-block px-10 py-4 md:py-6 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl text-lg font-semibold"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

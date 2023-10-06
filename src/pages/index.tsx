import { Raleway } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import ProductItem from '@/components/ProductItem';
import useToggle from '@/hooks/useToggle';

const raleway = Raleway({
    subsets: ['latin'],
    weight: ['100', '300', '400', '500', '700', '900'],
    variable: '--raleway',
});

export default function Home() {
    return (
        <main className={raleway.variable}>
            <div className="bg-gray-200/50">
                <div className="flex flex-col min-h-[65vh] mb-10">
                    <Header />
                    <Hero />
                </div>
                <Shop />
                <Contact />
            </div>
        </main>
    );
}

function Header() {
    const { state: toggleMenuState, toggle: toggleMenu } = useToggle();
    const {
        state: scrollState,
        open: openScrollState,
        close: closeScrollState,
    } = useToggle();

    useEffect(() => {
        const handleScrollSateChange = () => {
            console.log(window.scrollY);

            if (window.scrollY >= 200) openScrollState();
            else closeScrollState();
        };

        window.addEventListener('scroll', handleScrollSateChange);

        return () => {
            window.removeEventListener('scroll', handleScrollSateChange);
        };
    }, [closeScrollState, openScrollState]);

    return (
        <header
            className={`py-6 top-0 w-full left-0 z-10 text-white border-b border-white/10 ${
                scrollState ? 'bg-black/30 fixed backdrop-blur-xl' : 'absolute'
            }`}
        >
            <div className="container relative flex items-center justify-between gap-5">
                <div className="">LOGO</div>
                <nav className="absolute md:relative top-full right-5">
                    <ul
                        className={`uppercase tracking-wide flex flex-col md:flex-row gap-3 md:items-center p-4 rounded-xl border-2 border-white/10 ${
                            scrollState ? 'bg-black/30' : 'bg-white/15'
                        } backdrop-blur-lg translate-y-5 md:translate-y-0 md:!block ${
                            toggleMenuState ? 'block' : 'hidden'
                        }`}
                    >
                        <Link href="/" className="px-3 py-2">
                            Home
                        </Link>
                        <Link href="#shop" className="px-3 py-2">
                            Shop
                        </Link>
                        <Link href="#contact" className="px-3 py-2">
                            Contact
                        </Link>
                    </ul>
                </nav>
                <div className="flex items-center gap-4">
                    <button className="w-12 h-12 rounded-full flex justify-center border border-white/10 items-center bg-white/25 backdrop-blur-lg">
                        <Image
                            width={24}
                            height={24}
                            src="/cart.svg"
                            alt="your cart"
                        />
                    </button>
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
                src="/hero-image.jpg"
                className="hero-background absolute inset-0 top-0 right-0 w-full h-full object-cover object-center brightness-[0.65] -z-10"
            />
            <div className="container overflow-hidden grow rounded relative isolate flex items-center justify-center">
                <div className="flex flex-col gap-6 items-center text-white max-w-3xl text-center">
                    <h3 className="uppercase text-xs md:text-sm">daat foods</h3>
                    <h1 className="font-bold text-4xl md:text-6xl tracking-wide">
                        Get Quality Food Stuff at your Door Step!
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

function Shop() {
    return (
        <section id="shop" className="flex flex-col gap-16 py-16">
            <header className="flex justify-center">
                <h2 className="uppercase text-center text-slate-700 text-2xl relative before:block before:absolute before:w-3/5 before:h-1 before:bg-slate-700 before:bottom-0 before:left-1/2 before:-translate-x-1/2 pb-10">
                    shop
                </h2>
            </header>
            <div className="container grid grid-cols-[repeat(auto-fit,minmax(320px,320px))] gap-7 justify-around">
                <ProductItem
                    price={300}
                    name="Garri Ijebu(Ijebu)"
                    amountInStock={34}
                    image="/hero-image.jpg"
                />
                <ProductItem
                    price={300}
                    name="Somehting"
                    amountInStock={34}
                    image="/hero-image.jpg"
                />
                <ProductItem
                    price={300}
                    name="Somehting"
                    amountInStock={34}
                    image="/hero-image.jpg"
                />
                <ProductItem
                    price={300}
                    name="Somehting"
                    amountInStock={34}
                    image="/hero-image.jpg"
                />
                <ProductItem
                    price={300}
                    name="Somehting"
                    amountInStock={34}
                    image="/hero-image.jpg"
                />
            </div>
        </section>
    );
}

function Contact() {
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
                            <a href="">Facebook</a>
                            <a href="">Instagram</a>
                            <a href="">Whatsapp</a>
                            <a href="">Linkedin</a>
                        </div>
                    </footer>
                </div>
                <div className="grow w-full flex flex-col justify-center px-4 md:px-10 gap-16 border-l border-r border-white/10 bg-white/10 backdrop-blur-xl text-white py-16">
                    <h2 className="text-2xl font-bold">Contact Us!</h2>
                    <form className="flex flex-col gap-10">
                        <div className="flex flex-col gap-4">
                            <label htmlFor="name" className="font-semibold">
                                Your Name*
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                className="border-b border-white bg-transparent w-full px-6 py-4 outline-none text-lg"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="email" className="font-semibold">
                                Your Email Address*
                            </label>
                            <input
                                id="email"
                                type="email"
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
                                required
                                className="border-b border-white bg-transparent w-full px-6 py-4 outline-none text-lg min-h-[100px]"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="clickable w-full inline-block px-10 py-4 md:py-6 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl text-lg font-semibold"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

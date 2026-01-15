"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const Hero = () => {
    return (
        <section className="relative h-[85vh] lg:h-[95vh] w-full overflow-hidden flex items-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero.png"
                    alt="Luxury Hotel Hero"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
            </div>

            <div className="container mx-auto px-6 relative z-20">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-blue-400 font-medium tracking-[0.2em] mb-4 uppercase text-sm sm:text-base">
                            Experience the Extraordinary
                        </h2>
                        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white leading-[1.1] mb-8">
                            Luxury for the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">whole family,</span>
                            <br />all year round.
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-wrap gap-4"
                    >
                        <Link href={"/contact"} className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-xl shadow-blue-500/20">
                            Book Your Stay
                        </Link>
                        <Link href={"/rooms"} className="px-8 py-4 bg-white/10 text-white backdrop-blur-md border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all">
                            Explore Rooms
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden lg:block"
            >
                <div className="w-[30px] h-[50px] border-2 border-white/30 rounded-full flex justify-center p-1.5">
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    )
}

export default Hero


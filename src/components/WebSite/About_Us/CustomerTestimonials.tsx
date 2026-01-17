import Image from 'next/image';
import React from 'react';

const testimonials = [
    {
        name: "John Smith",
        text: "Amazing service and very comfortable rooms! Will definitely come back.",
        img: "/images/r54.jpg"
    },
    {
        name: "Maria Gomez",
        text: "The staff were incredibly friendly and the food was delicious.",
        img: "/images/r22.jpg"
    },
];

const CustomerTestimonials = () => {
    return (
        <section className="bg-gray-100 dark:bg-gray-800 py-12 px-6 md:px-16 text-center">
            <h3 className="text-3xl font-bold mb-10">What Our Guests Say</h3>
            <div className="flex flex-wrap justify-center gap-8">
                {testimonials.map((t, i) => (
                    <div key={i} className="bg-white dark:bg-gray-700 p-6 rounded shadow max-w-sm">
                        <Image src={t.img} width={20} height={20} className="w-20 h-20 mx-auto rounded-full mb-4" alt={t.name} />
                        <p className="text-gray-600 dark:text-gray-300 italic mb-2">&quot;{t.text}&quot;</p>
                        <h4 className="text-gray-800 dark:text-gray-100 font-bold">{t.name}</h4>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CustomerTestimonials;

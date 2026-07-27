"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

//const filterid = 'card-1'; // Example filterid, replace with actual logic
const projects = [
    {
        title: `Project ${1}`,
        description: `A deep dive into kinetic scrolling and interactive design.`,
    },
    {
        title: `Project ${2}`,
        description: `Another exploration of interactive design patterns.`,
    },
];

export default function StickyCardsSection() {
    const ref = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Ensure the component is mounted before using useScroll with target
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { scrollYProgress } = useScroll({
        target: isMounted ? ref : undefined,
        offset: ['start start', 'end end'],
    });

    const firstCardScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const firstCardRotate = useTransform(scrollYProgress, [0, 0.5], [0, -5]);
    const firstCardZIndex = useTransform(scrollYProgress, [0, 0.49, 0.5], [2, 2, 1]);
    
    const secondCardScale = useTransform(scrollYProgress, [0.5, 1], [0.8, 1]);
    const secondCardRotate = useTransform(scrollYProgress, [0.5, 1], [5, 0]);
    const secondCardZIndex = useTransform(scrollYProgress, [0, 0.5, 0.51], [1, 1, 2]);

    const cards = projects.slice(0, 2);
    if (cards.length < 2) return null;

    // Don't render the animated content until mounted to prevent hydration issues
    if (!isMounted) {
        return (
            <section ref={ref} className="relative h-[200vh] bg-background py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-headline font-bold text-primary">Featured Work</h2>
                    <p className="text-lg text-muted-foreground mt-2">Scroll through our projects.</p>
                </div>
                <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
                    <div className="flex relative w-[90vw] max-w-4xl h-[70vh]">
                        <Card className="h-full w-full overflow-hidden shadow-2xl bg-card border-accent/10">
                            <div className="grid md:grid-cols-2 h-full">
                                <div className="p-6 flex flex-col justify-center">
                                    <CardHeader>
                                        <CardTitle className="font-headline text-3xl text-primary">{cards[0].title}</CardTitle>
                                        <CardDescription className="text-base">{cards[0].description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">This project explores advanced scroll-triggered animations to create an immersive and engaging user experience. By leveraging framer-motion, we bring static content to life.</p>
                                    </CardContent>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={ref} className="relative h-[200vh] bg-background">
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
                <div className="text-center mb-8 z-10">
                    <h2 className="text-4xl font-headline font-bold text-primary">Featured Work</h2>
                    <p className="text-lg text-muted-foreground mt-2">Scroll through our projects.</p>
                </div>
                <div className="relative w-full h-[70vh] flex items-center justify-center">
                    <motion.div style={{
                            scale: secondCardScale,
                            rotate: secondCardRotate,
                            zIndex: secondCardZIndex,
                    }} className="absolute w-[90vw] max-w-4xl h-full">
                    <Card className="h-full w-full overflow-hidden shadow-2xl bg-card border-accent/10">
                        <div className="grid md:grid-cols-2 h-full">
                            <div className="p-6 flex flex-col justify-center">
                                <CardHeader>
                                    <CardTitle className="font-headline text-3xl text-primary">{cards[1].title}</CardTitle>
                                    <CardDescription className="text-base">{cards[1].description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">This project explores advanced scroll-triggered animations to create an immersive and engaging user experience. By leveraging framer-motion, we bring static content to life.</p>
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                    </motion.div>
                    <motion.div
                            style={{
                                    scale: firstCardScale,
                                    rotate: firstCardRotate,
                                    zIndex: firstCardZIndex,
                            }}
                            className="absolute w-[90vw] max-w-4xl h-full"
                        >
                    <Card className="h-full w-full overflow-hidden shadow-2xl bg-card border-accent/10">
                        <div className="grid md:grid-cols-2 h-full">
                            <div className="p-6 flex flex-col justify-center">
                                <CardHeader>
                                    <CardTitle className="font-headline text-3xl text-primary">{cards[0].title}</CardTitle>
                                    <CardDescription className="text-base">{cards[0].description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">This project explores advanced scroll-triggered animations to create an immersive and engaging user experience. By leveraging framer-motion, we bring static content to life.</p>
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
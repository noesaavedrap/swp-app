import React from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { HeroHeader } from '@/components/hero-section-1-header'
import { Spotify } from '@/components/ui/svgs/spotify'
import { SupabaseFull } from '@/components/ui/svgs/supabase'
import { Hulu } from '@/components/ui/svgs/hulu'
import { Bolt } from '@/components/ui/svgs/bolt'
import { FirebaseFull } from '@/components/ui/svgs/firebase'
import { Beacon } from '@/components/ui/svgs/beacon'
import { Claude } from '@/components/ui/svgs/claude'
import { VercelFull } from '@/components/ui/svgs/vercel'

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <section>
                    <div className="relative pt-24 md:pt-36">
                        <div className="mx-auto max-w-7xl">
                            <div className="px-6 text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <Link
                                    href="#link"
                                    className="group mx-auto flex w-fit items-center gap-3 rounded-full p-1 pl-4 transition-colors duration-300">
                                    <span className="text-sm font-medium">New:</span>
                                    <span className="text-muted-foreground text-sm">Introducing the living customer graph</span>

                                    <div className="size-6 overflow-hidden rounded-full duration-500">
                                        <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                            <span className="flex size-6">
                                                <ArrowRight className="m-auto size-3" />
                                            </span>
                                            <span className="flex size-6">
                                                <ArrowRight className="m-auto size-3" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                <h1 className="mx-auto mt-8 max-w-4xl text-balance text-5xl font-medium tracking-tight md:text-6xl lg:mt-12 xl:text-7xl">Customer universe, beautifully connected</h1>
                                <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-balance md:text-lg">Every account, signal, conversation, and next move in one living workspace that helps teams turn momentum into revenue.</p>

                                <div className="mt-6 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <Button
                                        key={1}
                                        nativeButton={false}
                                        render={
                                            <Link href="#">
                                                <span className="text-nowrap">Explore the graph</span>
                                            </Link>
                                        }
                                    />

                                    <Button
                                        key={2}
                                        variant="ghost"
                                        nativeButton={false}
                                        render={
                                            <Link href="#">
                                                <span className="text-nowrap">Watch the flow</span>
                                            </Link>
                                        }
                                    />
                                </div>
                            </div>

                            <div className="relative mt-8 overflow-hidden border-y border-foreground/10 py-6 max-sm:-mr-56 sm:mt-16">
                                <div className="bg-background ring-foreground/10 relative border ring-1">
                                    <Image
                                        className="bg-background aspect-15/8 relative"
                                        src="/mail2.png"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-background pb-16 pt-6 md:pb-32">
                    <div className="group relative m-auto max-w-5xl px-6">
                        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                            <Link
                                href="/"
                                className="block text-sm duration-150 hover:opacity-75">
                                <span> See the network</span>

                                <ChevronRight className="ml-1 inline-block size-3" />
                            </Link>
                        </div>
                        <div className="**:fill-foreground mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-14 md:grid-cols-4">
                            <div className="flex items-center">
                                <Bolt className="mx-auto h-5 w-full" />
                            </div>
                            <div className="flex items-center">
                                <VercelFull className="mx-auto h-4 w-full" />
                            </div>
                            <div className="flex items-center">
                                <SupabaseFull className="mx-auto h-6" />
                            </div>
                            <div className="flex items-center">
                                <Hulu className="mx-auto h-4 w-full" />
                            </div>
                            <div className="flex items-center">
                                <Spotify className="mx-auto h-6 w-full" />
                            </div>
                            <div className="flex items-center">
                                <FirebaseFull className="mx-auto h-6 w-full" />
                            </div>
                            <div className="hidden items-center sm:flex">
                                <Beacon className="mx-auto h-4 w-full" />
                            </div>

                            <div className="hidden items-center sm:flex">
                                <Claude className="mx-auto h-5 w-full" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

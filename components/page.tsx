'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Mountain } from "lucide-react"

export function LandingPageComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      {false &&
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <>
        <Link className="flex items-center justify-center" href="#">
          <Mountain className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
        </nav>
        </>
      </header>
      }
      <main className="flex-1 bg-gray-900">
        <section className="w-full h-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col h-full items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl text-white font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Plot Twist
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl dark:text-gray-400">
                  Where every mystery has a twist and it&apos;s yours to create
                </p>
              </div>
              <div className="flex space-x-4">
                <Link href="/signin">
                  <Button className="inline-flex bg-purple-700 hover:bg-purple-800 items-center justify-center">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                {/*
                <Link href="/signup">
                  <Button variant="outline" className="inline-flex items-center justify-center">
                    Sign Up
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                */}
              </div>
            </div>
          </div>
        </section>
      </main>
      {false &&
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 Acme Inc. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
      }
    </div>
  )
}
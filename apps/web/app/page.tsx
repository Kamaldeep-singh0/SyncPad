import React from 'react'
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText, Square } from "lucide-react";

function page() {
  return (
         <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-brand-blue to-brand-purple p-1 rounded">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 9H3V7H9V9Z" />
              <path d="M9 5H5V3H9V5Z" />
              <path d="M19 21H5C3.89543 21 3 20.1046 3 19V13H5V19H19V5H13V3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" />
              <path d="M15 9V3H17V9H15Z" />
              <path d="M13 17H11V11H13V17Z" />
              <path d="M9 15H3V13H9V15Z" />
            </svg>
          </div>
          <span className="font-bold text-xl">SyncPad</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/app">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/app">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Real-time Collaboration for Teams
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    SyncPad brings your team together with shared documents and whiteboards.
                    Edit markdown, draw together, and collaborate in real-time.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/app">
                    <Button size="lg" className="bg-gradient-to-r from-brand-blue to-brand-purple">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/app">
                    <Button size="lg" variant="outline">
                      Live Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                <div className="w-full overflow-hidden rounded-lg border bg-gradient-to-b from-background/10 to-background/80 shadow-xl backdrop-blur">
                  <div className="border-b bg-muted/50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <div className="ml-2 font-medium">Document.md</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 divide-x">
                    <div className="p-4 font-mono text-sm">
                      <div className="text-muted-foreground"># SyncPad</div>
                      <div className="mt-2">
                        A **real-time** collaboration tool for teams.
                      </div>
                      <div className="mt-4 text-muted-foreground">## Features</div>
                      <div className="mt-2">- Markdown editing</div>
                      <div>- Shared whiteboard</div>
                      <div>- User presence</div>
                    </div>
                    <div className="p-4 text-sm">
                      <div className="text-2xl font-bold">SyncPad</div>
                      <div className="mt-2">
                        A <span className="font-bold">real-time</span> collaboration tool for teams.
                      </div>
                      <div className="mt-4 text-xl font-bold">Features</div>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Markdown editing</li>
                        <li>Shared whiteboard</li>
                        <li>User presence</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Everything you need to collaborate effectively with your team in one place.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Document Editor</h3>
                <p className="text-center text-muted-foreground">
                  Collaborative Markdown editor with real-time changes and formatting.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Square className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Shared Whiteboard</h3>
                <p className="text-center text-muted-foreground">
                  Interactive canvas for diagrams, drawings, and visual collaboration.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <circle cx="12" cy="6" r="4" />
                    <circle cx="18" cy="16" r="4" />
                    <circle cx="6" cy="16" r="4" />
                    <line x1="12" y1="10" x2="18" y2="12" />
                    <line x1="12" y1="10" x2="6" y2="12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Real-time Presence</h3>
                <p className="text-center text-muted-foreground">
                  See who's online, track cursors, and collaborate in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <p className="text-sm text-muted-foreground">
            © 2025 SyncPad. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="#" className="text-sm text-muted-foreground underline">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-muted-foreground underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
      
    
  )
}

export default page

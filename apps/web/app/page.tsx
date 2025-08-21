import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, FileText, Palette, Zap } from "lucide-react"

const SyncPadLandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-black">SyncPAD</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/auth" className="text-gray-600 hover:text-black font-medium">
                Sign In
              </Link>
              <Button asChild className="bg-black hover:bg-gray-800 text-white">
                <Link href="/auth?mode=signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-black leading-tight">
                Collaborate in
                <span className="text-black"> Real-Time</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                The ultimate workspace for teams to create, edit, and brainstorm together. Documents, whiteboards, and
                real-time collaboration in one powerful platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-black hover:bg-gray-800 text-white">
                <Link href="/auth?mode=signup">
                  Start Collaborating <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-gray-300 hover:bg-gray-50 bg-transparent">
                <Link href="/auth">Sign In</Link>
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Real-time collaboration</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Instant sync</span>
              </div>
            </div>
          </div>

          {/* Preview Component */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gray-100 rounded-2xl blur-xl"></div>
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 cursor-pointer transition-colors"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 cursor-pointer transition-colors"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 cursor-pointer transition-colors"></div>
                  </div>
                  <div className="text-sm font-medium text-gray-700 ml-4">Project-Brief.md</div>
                  <div className="ml-auto flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                      A
                    </div>
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                      M
                    </div>
                    <span className="text-xs text-gray-500">+3</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-gray-200">
                <div className="p-6 bg-black text-green-400 font-mono text-sm">
                  <div className="space-y-2">
                    <div className="text-gray-500"># Project Overview</div>
                    <div className="text-white">
                      A <span className="bg-yellow-400 text-black px-1">collaborative</span> platform for
                    </div>
                    <div className="text-white">remote teams to work together.</div>
                    <div className="text-gray-500 mt-4">## Key Benefits</div>
                    <div className="text-white">- Real-time editing</div>
                    <div className="text-white">- Visual collaboration</div>
                    <div className="text-white">- Team presence indicators</div>
                    <div className="mt-4">
                      <span className="animate-pulse bg-blue-500 w-2 h-4 inline-block"></span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-black">Project Overview</h3>
                    <p className="text-gray-700">
                      A <strong>collaborative</strong> platform for remote teams to work together.
                    </p>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-black">Key Benefits</h4>
                      <ul className="space-y-1 list-disc list-inside text-gray-700">
                        <li>Real-time editing</li>
                        <li>Visual collaboration</li>
                        <li>Team presence indicators</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Everything you need to collaborate</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed for modern teams who need to create, share, and iterate together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Real-time Documents</h3>
              <p className="text-gray-600">
                Edit documents together with live cursors, comments, and instant synchronization.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Interactive Whiteboards</h3>
              <p className="text-gray-600">
                Brainstorm visually with drawing tools, sticky notes, and collaborative canvases.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Team Presence</h3>
              <p className="text-gray-600">
                See who's online, track changes, and manage permissions with advanced team controls.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to transform how your team collaborates?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of teams already using SyncPAD to create amazing work together.
          </p>
          <Button size="lg" variant="secondary" asChild className="bg-white text-black hover:bg-gray-100">
            <Link href="/auth?mode=signup">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">SyncPAD</span>
            </div>
            <p className="text-sm">© 2024 SyncPAD. Built for collaborative teams.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SyncPadLandingPage

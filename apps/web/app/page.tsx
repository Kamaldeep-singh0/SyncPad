import React from 'react';
import { FileText, Square, Users, ArrowRight, Check } from 'lucide-react';

const NavBar = () => (
  <nav className="bg-white border-b border-gray-100 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <span className="text-xl font-bold text-gray-900">SyncPad</span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors">
          Login
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Sign Up
        </button>
      </div>
    </div>
  </nav>
);

const TrustedBySection = () => (
  <div className="bg-gray-50 py-12">
    <div className="max-w-7xl mx-auto px-6">
      <p className="text-center text-sm font-medium text-gray-500 mb-8">
        TRUSTED BY TEAMS AT
      </p>
      <div className="flex justify-center items-center space-x-12 opacity-60">
        {['TechCorp', 'InnovateLabs', 'DigitalFlow', 'TeamSync', 'CodeBase'].map((company) => (
          <div key={company} className="text-gray-400 font-semibold text-lg">
            {company}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProfessionalLandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Now in Beta
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Real-time
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Collaboration
                </span>
                for Teams
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                SyncPad brings your team together with shared documents and whiteboards. 
                Edit markdown, draw together, and collaborate seamlessly in real-time.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl">
                Get Started Free
                <ArrowRight size={20} className="ml-2" />
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-semibold transition-all duration-200">
                Watch Demo
              </button>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Check size={16} className="mr-2 text-green-500" />
                Free 14-day trial
              </div>
              <div className="flex items-center">
                <Check size={16} className="mr-2 text-green-500" />
                No credit card required
              </div>
            </div>
          </div>
          
          {/* Enhanced Demo Preview */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-sm font-medium text-gray-700 ml-4">
                    Project-Brief.md
                  </div>
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
                <div className="p-6 bg-gray-900 text-green-400 font-mono text-sm">
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
                    <h3 className="text-2xl font-bold text-gray-900">Project Overview</h3>
                    <p className="text-gray-700">
                      A <strong>collaborative</strong> platform for remote teams to work together.
                    </p>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-gray-900">Key Benefits</h4>
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
      
      <TrustedBySection />
      
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              collaborate effectively
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful tools designed for modern teams who value speed, quality, and seamless collaboration.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: FileText,
              title: "Document Editor",
              description: "Professional Markdown editor with syntax highlighting, real-time collaboration, and version control.",
              features: ["Syntax highlighting", "Live preview", "Version history", "Export options"]
            },
            {
              icon: Square,
              title: "Shared Whiteboard",
              description: "Infinite canvas for diagrams, wireframes, and visual brainstorming with your team.",
              features: ["Infinite canvas", "Shape tools", "Image support", "Template library"]
            },
            {
              icon: Users,
              title: "Real-time Presence",
              description: "See who's online, track live cursors, and collaborate with confidence in real-time.",
              features: ["Live cursors", "User avatars", "Activity feed", "Smart notifications"]
            }
          ].map((feature, index) => (
            <div key={index} className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
              <ul className="space-y-2">
                {feature.features.map((item, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-500">
                    <Check size={16} className="mr-2 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to transform your team's collaboration?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using SyncPad to work better, faster, and more efficiently together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-200 shadow-lg">
              Start Free Trial
              <ArrowRight size={20} className="ml-2" />
            </button>
            <button className="border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalLandingPage;
import React from 'react'
import { FileText, Square, Users,  Check } from 'lucide-react';

function Features() {
  return (
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
  )
}

export default Features

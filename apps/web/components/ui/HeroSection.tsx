'use client';
import React from 'react'
import { ArrowRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

function HeroSection() {
   const router = useRouter();
  return (
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
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl" onClick={()=> router.push('/auth?mode=signup')}>
                Get Started Free
                <ArrowRight size={20} className="ml-2" />
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-semibold transition-all duration-200" onClick={()=> router.push('/dashboard')}>
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
  )
}

export default HeroSection

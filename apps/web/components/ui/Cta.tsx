import { ArrowRight } from 'lucide-react'
import React from 'react'

function Cta() {
  return (
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
  )
}

export default Cta

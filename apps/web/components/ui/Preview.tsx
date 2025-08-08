import React from 'react'

function Preview() {
  return (
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
  )
}

export default Preview

import { Bitcoin, Gamepad2, Github, Twitter, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900/80 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                <Bitcoin className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BitGame</span>
            </div>
            <p className="text-gray-400 text-sm">
              The future of gaming is here. Play, earn, and transact with Bitcoin.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Games */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">Games</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Browse Games</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">New Releases</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Free to Play</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Tournaments</a></li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">Community</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Forums</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Events</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 BitGame. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Bitcoin className="w-4 h-4 text-orange-400" />
            <span>Secured by Bitcoin</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
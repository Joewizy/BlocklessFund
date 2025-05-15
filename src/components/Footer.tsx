import { Github, Twitter } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-border/10 py-12 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Logo and description */}
          <div className="max-w-xs">
            <h3 className="font-sans font-bold text-xl mb-3">
              Blockless<span className="text-fundngn-green">Fund</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Decentralized crowdfunding with cNGN on Base. Supporting innovation through community-powered funding.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://x.com/BruceWayne82118"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-primary transition-colors"
              >
                <Twitter size={18} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://github.com/Joewizy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-primary transition-colors"
              >
                <Github size={18} />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          {/* Links - simplified to two columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
            <div>
              <h3 className="font-medium text-sm mb-3 text-slate-800 dark:text-slate-200">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                  >
                    Explore
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                  >
                    Start a Campaign
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                  >
                    How It Works
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-3 text-slate-800 dark:text-slate-200">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                  >
                    cNGN Token
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-3 text-slate-800 dark:text-slate-200">About</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                  >
                    Team
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-slate-500 dark:text-slate-500">© 2025 BlocklessFund. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-xs text-slate-500 dark:text-slate-500 hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-xs text-slate-500 dark:text-slate-500 hover:text-primary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

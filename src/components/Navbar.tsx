"use client"

import { useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-black font-sans font-bold text-xl tracking-tight">
              Blockless<span className="text-fundngn-green">Fund</span>
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {/* Add Mint button before ConnectButton */}
          <Link to="/mint">
            <button className="bg-fundngn-green text-white px-4 py-2 rounded-md hover:bg-fundngn-darkgreen transition-colors text-sm font-medium">
              Mint cNGN
            </button>
          </Link>
          <ConnectButton showBalance={false} />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 bg-white shadow-lg p-5 mt-2 z-50">
          <div className="flex flex-col space-y-4">
            <Link to="/campaigns" className="text-gray-700 py-2 text-base font-medium">
              Campaigns
            </Link>
            <Link to="/proposal" className="text-gray-700 py-2 text-base font-medium">
              Proposals
            </Link>
            {/* Add Mint link in mobile menu */}
            <Link to="/mint" className="text-gray-700 py-2 text-base font-medium">
              Mint cNGN
            </Link>
            <div className="pt-4">
              <ConnectButton />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
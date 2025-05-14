"use client"

import { useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <span className="text-fundngn-green font-sans font-bold text-xl tracking-tight">
              Blockless<span className="text-fundngn-gold">Fund</span>
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          <a
            href="#"
            className="text-gray-700 hover:text-fundngn-green font-medium text-sm tracking-wide transition duration-200"
          >
            Explore
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-fundngn-green font-medium text-sm tracking-wide transition duration-200"
          >
            Learn
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-fundngn-green font-medium text-sm tracking-wide transition duration-200"
          >
            About
          </a>
        </nav>

        <div className="hidden md:flex items-center">
          {/* RainbowKit ConnectButton */}
          <ConnectButton />
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
            <a href="#" className="text-gray-700 py-2 text-base font-medium">
              Explore
            </a>
            <a href="#" className="text-gray-700 py-2 text-base font-medium">
              Learn
            </a>
            <a href="#" className="text-gray-700 py-2 text-base font-medium">
              About
            </a>
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

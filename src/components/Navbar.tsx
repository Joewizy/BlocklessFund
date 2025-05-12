
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <span className="text-fundngn-green font-poppins font-bold text-xl">Fund<span className="text-fundngn-gold">NGN</span></span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-700 hover:text-fundngn-green font-medium transition duration-150">Explore</a>
          <a href="#" className="text-gray-700 hover:text-fundngn-green font-medium transition duration-150">Create</a>
          <a href="#" className="text-gray-700 hover:text-fundngn-green font-medium transition duration-150">Learn</a>
          <a href="#" className="text-gray-700 hover:text-fundngn-green font-medium transition duration-150">About</a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" className="border-fundngn-green text-fundngn-green hover:bg-fundngn-green hover:text-white">
            Connect Wallet
          </Button>
          <Button className="bg-fundngn-green text-white hover:bg-fundngn-darkgreen">
            Start Campaign
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg p-4 border-t border-gray-100 z-50">
          <nav className="flex flex-col space-y-4 py-3">
            <a href="#" className="text-gray-700 hover:text-fundngn-green font-medium px-2 py-1">
              Explore
            </a>
            <a href="#" className="text-gray-700 hover:text-fundngn-green font-medium px-2 py-1">
              Create
            </a>
            <a href="#" className="text-gray-700 hover:text-fundngn-green font-medium px-2 py-1">
              Learn
            </a>
            <a href="#" className="text-gray-700 hover:text-fundngn-green font-medium px-2 py-1">
              About
            </a>
            <Button variant="outline" className="border-fundngn-green text-fundngn-green hover:bg-fundngn-green hover:text-white w-full justify-center mt-2">
              Connect Wallet
            </Button>
            <Button className="bg-fundngn-green text-white hover:bg-fundngn-darkgreen w-full justify-center">
              Start Campaign
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

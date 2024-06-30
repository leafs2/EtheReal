'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faBars } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-100 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-none">
          <Link href="/" className="flex items-center">
            <Image
              src="/EtheReal_Logo_v3.webp"
              alt="EtheReal Logo"
              width={150}
              height={40}
              className="object-contain"
            />
          </Link>
        </div>
        <div className="hidden md:flex flex-1 justify-center items-center space-x-6">
          <Link href="/fundraising" className="px-4 py-2 text-gray-800 hover:text-gray-600">
            開放募資
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/dashboard" className="px-4 py-2 text-gray-800 hover:text-gray-600">
            面板
          </Link>
        </div>
        <div className="hidden md:flex flex-none" style={{ minWidth: '200px' }}>
          <ConnectButton />
        </div>
        <div className="md:hidden flex items-center">
          {isOpen ? (
            <FontAwesomeIcon
              className="text-gray-800 text-2xl sm:text-3xl cursor-pointer"
              icon={faXmark}
              onClick={toggleMenu}
            />
          ) : (
            <FontAwesomeIcon
              className="text-gray-800 text-2xl sm:text-3xl cursor-pointer"
              icon={faBars}
              onClick={toggleMenu}
            />
          )}
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-gray-200 p-4">
          <Link href="/fundraising" className="block text-gray-800 hover:text-gray-600 font-semibold mb-2">
            開放募資
          </Link>
          <Link href="/dashboard" className="block text-gray-800 hover:text-gray-600 font-semibold mb-2">
            面板
          </Link>
          <div className="mt-4">
            <ConnectButton />
          </div>
        </div>
      )}
    </nav>
  );
}

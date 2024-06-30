'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

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
        <div className="flex-1 flex justify-center items-center space-x-6 ml-25">
          <div className="relative bg-white rounded-full shadow-md flex items-center">
            <Link href="/fundraising" className="px-4 py-2 text-gray-800 hover:text-gray-600">
              開放募資
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/dashboard" className="px-4 py-2 text-gray-800 hover:text-gray-600">
              面板
            </Link>
          </div>
        </div>
        <div className="flex-none" style={{ minWidth: '200px' }}>
          <ConnectButton />
        </div>
        <div className="md:hidden">
          {isOpen ? (
            <FontAwesomeIcon
              className="text-gray-800 text-2xl sm:text-3xl cursor-pointer"
              icon={faXmark}
              onClick={toggleMenu}
            />
          ) : (
            <button className="text-gray-800 focus:outline-none" onClick={toggleMenu}>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="flex flex-col md:hidden bg-gray-200 p-4 gap-5">
          <Link href="/fundraising" className="text-gray-800 hover:text-gray-600 font-semibold">
            開放募資
          </Link>
          <Link href="/dashboard" className="text-gray-800 hover:text-gray-600 font-semibold">
            面板
          </Link>
          <ConnectButton />
        </div>
      )}
    </nav>
  );
}

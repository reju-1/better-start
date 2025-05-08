"use client";

import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-primary fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-9">
        {/* Left links */}
        <div className="flex space-x-8 text-[18px] text-gray-700 font-medium">
          <Link href="#" className="hover:text-purple-600">
            Dashboard
          </Link>
          <Link href="#" className="hover:text-purple-600">
            Transaction
          </Link>
          <Link href="#" className="hover:text-purple-600">
            HR
          </Link>
          <Link href="#" className="hover:text-purple-600">
            Portfolio
          </Link>
        </div>

        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            src="/images/betterstart-logo.png"
            alt="BetterStart"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
        </div>

        {/* Right links + avatar */}
        <div className="flex items-center space-x-6 text-[18px] text-gray-700 font-medium">
          <Link href="#" className="hover:text-purple-600">
            Extras
          </Link>
          <Link href="#" className="hover:text-purple-600">
            Pricing
          </Link>
          <Link href="#" className="hover:text-purple-600">
            Help
          </Link>
          <span className="h-6 border-l border-gray-300"></span>
          <div className="flex items-center space-x-2">
            <Image
              src="https://i.pravatar.cc/32"
              alt="User avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium">maomislive</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

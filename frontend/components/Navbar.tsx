'use client'; // only needed in app directory

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo + Brand Name */}
      <Link href="/">
        <Image
            src="/logo.svg"
            alt="Logo"
            width={100}
            height={100}
        />
      </Link>

      {/* Navigation buttons */}
      <div className="space-x-4">
        <Link
          href="/login"
          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50 transition"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Signup
        </Link>
      </div>
    </nav>
  );
}

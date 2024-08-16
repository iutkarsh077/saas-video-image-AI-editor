import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import React from 'react';
const Header = () => {
    const { userId } = auth();

  return (
    <div className="bg-gray-800 p-4">
      {
        userId ? (<nav className="flex justify-center items-center space-x-6">
            <Link href="/home" className="text-white font-medium hover:text-gray-300">
                Home
              </Link>
              <Link href="/image-transform" className="text-white font-medium hover:text-gray-300">
                Image-Format
              </Link>
              <Link href="/Video-upload" className="text-white font-medium hover:text-gray-300">
                Video-Compress
              </Link>
            </nav>) :(
                <div className='flex justify-center items-center font-semibold'>Please Ignore the UI just like my career.</div>
            )
      }
    </div>
  );
}

export default Header;

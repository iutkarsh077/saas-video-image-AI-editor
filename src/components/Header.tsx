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
               <nav className='flex gap-x-10 justify-between'>
                 <div className='sm:flex justify-center hidden items-center font-semibold'>Please Ignore the UI just like my career.</div>
                 <Link href={"/sign-in"} className='bg-blue-500 p-3 hover:bg-blue-700 rounded-xl hover:shadow-xl ease-in-out duration-300 transition-all'>Login Here</Link>
               </nav>
            )
      }
    </div>
  );
}

export default Header;

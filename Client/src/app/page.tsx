import * as React from 'react'
import Test from '@/components/test';
import Link from 'next/link';

function page() {
    return (
        <div className="flex flex-col font-pop items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
            <Test />

        </div>
    );
}


export default page;
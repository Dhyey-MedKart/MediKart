import Link from 'next/link';
import React from 'react';
import LoginForm from '../../components/LoginForm';

function page() {
    return (
        <div className="flex flex-col font-pop items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
            <h1 className="text-4xl font-bold text-white mb-6">Login</h1>
            <LoginForm />
            <p className="text-white mt-4">
                Dont have an account? Create one{' '}
                <Link href="/register" className="text-yellow-300 underline">
                    here
                </Link>
            </p>
        </div>
    );
}

export default page;
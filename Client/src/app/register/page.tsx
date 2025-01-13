import Link from 'next/link';
import React from 'react';
import RegisterForm from '../../components/RegisterForm';

function page() {
    return (
        <div className="flex flex-col font-pop items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
            <h1 className="text-4xl font-bold text-white mb-6">Register</h1>
            <RegisterForm />
            <p className="text-white mt-4">
                Already have an account? Login {' '}
                <Link href="/login" className="text-yellow-300 underline">
                    here
                </Link>
            </p>
        </div>
    );
}

export default page;
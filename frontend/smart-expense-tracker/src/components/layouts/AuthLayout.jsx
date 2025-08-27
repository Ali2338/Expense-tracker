import React from 'react';
import CARD from '../../assets/card.png';
import { LuTrendingUpDown } from 'react-icons/lu';

// StatsInfoCard Component
const StatsInfoCard = ({ icons, label, value, color }) => {
    return (
        <div className='flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10'>
            <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
                {icons}
            </div>
            <div>
                <h6 className='text-xs text-gray-500 mb-1'>{label}</h6>
                <span className='text-[20px]'>${value}</span>
            </div>
        </div>
    );
};

// AuthLayout Component
const AuthLayout = ({ children }) => {
    return (
        <div className='flex w-screen h-screen'>
            {/* Left Panel */}
            <div className="w-full md:w-3/5 px-12 pt-8 pb-12">
                <h2 className="text-lg font-medium text-black">Smart Expense Tracker</h2>
                {children}
            </div>

            {/* Right Panel */}
            <div className='hidden md:flex flex-col justify-between w-2/5 h-full bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative'>

                {/* Floating background shapes */}
                <div className='w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5' />
                <div className='w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10' />
                <div className='w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5' />

                {/* StatsInfoCard goes here */}
                <div className='z-20'>
                    <StatsInfoCard
                        icons={<LuTrendingUpDown />}
                        label='Track Your Income & Expenses'
                        value='430,000'
                        color='bg-purple-500'
                    />
                </div>

                {/* Card image at the bottom */}
                <img src={CARD} alt="card" className='w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15' />
            </div>
        </div>
    );
};

export default AuthLayout;

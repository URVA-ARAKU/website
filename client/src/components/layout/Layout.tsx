import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { Outlet, useLocation } from 'react-router-dom';


const Layout: React.FC = () => {
    const { pathname } = useLocation();
    const isHomePage = pathname === '/';

    return (
        <>
            <div className='w-full'>

                <Header />
                <main className={isHomePage ? 'w-full' : 'container mx-auto p-4'}>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Layout;

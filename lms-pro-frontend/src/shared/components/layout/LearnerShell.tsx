import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function LearnerShell() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />
      <main className="flex-grow pt-[60px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

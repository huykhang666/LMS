import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';

export function Error404Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft/20 text-accent mb-4">
        <HelpCircle className="h-10 w-10" />
      </div>
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">Trang không tồn tại</h1>
      <p className="mt-2 text-ink-soft max-w-md">
        Không tìm thấy trang bạn yêu cầu. Có thể địa chỉ đã thay đổi hoặc đường dẫn không còn tồn tại.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-accent/90 transition-all"
      >
        <Home className="h-4 w-4" />
        Về trang chủ
      </Link>
    </div>
  );
}

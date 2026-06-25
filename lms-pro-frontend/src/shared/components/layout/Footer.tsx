import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-paper-dim py-12 text-ink-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-ink">
              <BookOpen className="h-6 w-6 text-accent" strokeWidth={2.5} />
              <span className="font-display text-xl font-bold tracking-tight">LMS <span className="text-accent italic">Pro</span></span>
            </Link>
            <p className="text-sm max-w-sm">
              Hệ thống quản lý học tập trực tuyến tiêu chuẩn. Thiết kế theo phong cách sổ tay Việt Nam mộc mạc và trực quan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-sm font-semibold uppercase tracking-wider text-ink">Đường dẫn</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/courses" className="hover:text-accent transition-colors">Khám phá khóa học</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-accent transition-colors">Đăng nhập</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-accent transition-colors">Đăng ký thành viên</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-body text-sm font-semibold uppercase tracking-wider text-ink">Lĩnh vực phổ biến</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/courses?category=programming" className="hover:text-accent transition-colors">Lập trình ứng dụng</Link>
              </li>
              <li>
                <Link to="/courses?category=ai" className="hover:text-accent transition-colors">Trí tuệ nhân tạo (AI)</Link>
              </li>
              <li>
                <Link to="/courses?category=english" className="hover:text-accent transition-colors">Tiếng Anh thương mại</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>© {currentYear} LMS Pro. Bản quyền thuộc về học viên và tác giả.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-accent transition-colors">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  TrendingUp,
  BookOpen,
  Star,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Tuyên bố tâm thức mỗi ngày",
    description:
      "Đọc và ghi nhận tuyên bố thịnh vượng giúp lập trình lại tư duy giàu có từ bên trong.",
  },
  {
    icon: TrendingUp,
    title: "Theo dõi tiến độ cá nhân",
    description:
      "Hành trình của bạn tăng liên tục từ ngày 1 đến mãi mãi — không giới hạn, không reset.",
  },
  {
    icon: BookOpen,
    title: "5 dạng ngày luân phiên",
    description:
      "Mỗi ngày một chủ đề khác nhau: tuyên bố, mục tiêu, lòng biết ơn, giá trị bản thân...",
  },
  {
    icon: Star,
    title: "Ghi nhận thành công hằng ngày",
    description:
      "Liệt kê ít nhất 5 thành công mỗi ngày để xây dựng tư duy tích cực và biết ơn.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <header className="gradient-prosperity text-white">
        <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-2xl">✦</span>
            <span className="font-semibold text-lg tracking-tight">
              Tâm Thức Thịnh Vượng
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-stone-300 hover:text-white hover:bg-white/10">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Bắt đầu ngay</Button>
            </Link>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-green-300 mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Thực hành hằng ngày
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-balance">
            Xây dựng{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500">
              tâm thức thịnh vượng
            </span>{" "}
            mỗi ngày
          </h1>
          <p className="text-lg text-stone-300 mb-10 max-w-xl mx-auto text-balance">
            Hành trình thực hành có hệ thống giúp bạn lập trình lại tư duy về
            tiền bạc, sự xứng đáng và thịnh vượng từ bên trong.
          </p>
          <Link href="/register">
            <Button size="lg" className="shadow-xl gap-2 px-8">
              Bắt đầu hành trình của bạn
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Features */}
      <main className="flex-1 bg-stone-50">
        <section className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center text-stone-900 mb-4">
            Phương pháp có hệ thống
          </h2>
          <p className="text-center text-stone-500 mb-14 max-w-xl mx-auto">
            Mỗi ngày là một bước tiến. Chương trình được thiết kế để bạn thực
            hành đều đặn và thấy sự thay đổi rõ rệt.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-stone-900 mb-2">{title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="gradient-prosperity py-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-stone-300 mb-8 max-w-md mx-auto">
            Tạo tài khoản miễn phí và bắt đầu ngay hôm nay.
          </p>
          <Link href="/register">
            <Button size="lg" className="shadow-xl px-10">
              Tạo tài khoản miễn phí
            </Button>
          </Link>
        </section>
      </main>

      <footer className="bg-stone-900 text-stone-500 py-8 text-center text-sm">
        <p>✦ Tâm Thức Thịnh Vượng — Hành trình làm giàu từ bên trong</p>
      </footer>
    </div>
  );
}

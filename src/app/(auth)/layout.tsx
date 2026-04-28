export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen gradient-prosperity flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white mb-2">
            <span className="text-green-400 text-3xl">✦</span>
            <span className="font-semibold text-xl tracking-tight">
              Tâm Thức Thịnh Vượng
            </span>
          </div>
          <p className="text-stone-400 text-sm">
            Hành trình làm giàu từ bên trong
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

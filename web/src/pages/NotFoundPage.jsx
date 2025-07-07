import { Link } from 'react-router';



function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center text-center">
      <div className="space-y-4">
        <h1 className="text-9xl font-bold tracking-tighter text-pri-gr1">404</h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Page Not Found</h2>
          <p className="text-muted-foreground">ขออภัย เราไม่พบหน้าที่คุณกำลังค้นหา</p>
        </div>
        <Link to="/"

          className="inline-flex h-10 items-center justify-center rounded-md bg-pri-gr2 px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-p/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          กลับไปหน้าหลัก
        </Link>
      </div>
    </div>
  )
}
export default NotFoundPage

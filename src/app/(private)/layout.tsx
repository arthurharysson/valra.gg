import { Sidebar } from '@/components/layout/Sidebar'

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth guard será implementado quando a integração com Riot API estiver pronta
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}

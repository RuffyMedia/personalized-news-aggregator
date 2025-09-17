import './globals.css'

export const metadata = {
  title: 'Unbiased News - Your Neutral News Source',
  description: 'Stay informed with balanced, fact-based news from diverse sources',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}

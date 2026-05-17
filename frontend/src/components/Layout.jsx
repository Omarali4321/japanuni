import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import PageTransition from './PageTransition'
import JapanBackdrop from './JapanBackdrop'

export default function Layout() {
  return (
    <div className="relative isolate min-h-screen flex flex-col">
      <JapanBackdrop />
      <Navbar />
      <main className="relative z-0 flex-1 pt-16">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}

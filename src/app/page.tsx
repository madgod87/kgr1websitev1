import { Metadata } from 'next'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: "Home | KGR-I",
  description: "Welcome to Krishnagar-I Development Block official website. Access government services, notifications, and community information.",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Services />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}

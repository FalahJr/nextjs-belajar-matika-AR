import { About } from '../components/home/About'
import { Benefits } from '../components/home/Benefits'
import { CardsGrid } from '../components/home/CardsGrid'
import { CtaSection } from '../components/home/CtaSection'
import { Hero } from '../components/home/Hero'
import { HowItWorks } from '../components/home/HowItWorks'
import { PageShell } from '../components/layout/PageShell'

export function HomePage() {
  return (
    <PageShell>
      <Hero />
      <HowItWorks />
      <CardsGrid />
      <Benefits />
      <About />
      <CtaSection />
    </PageShell>
  )
}

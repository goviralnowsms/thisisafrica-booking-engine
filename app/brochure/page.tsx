import type { Metadata } from "next"
import BrochureClientPage from "./BrochureClientPage"

export const metadata: Metadata = {
  title: "Africa Travel Brochure 2025 | This is Africa",
  description:
    "Download our comprehensive 108-page Africa travel brochure featuring safaris, luxury rail journeys, and tailor-made adventures across 12 African countries.",
  keywords:
    "Africa travel brochure, safari tours, African holidays, travel guide, Kenya, Tanzania, South Africa, Botswana",
  openGraph: {
    title: "Africa Travel Brochure 2025 | This is Africa",
    description:
      "Download our comprehensive 108-page Africa travel brochure featuring safaris, luxury rail journeys, and tailor-made adventures.",
    images: ["/images/cheetah-hero.jpg"],
  },
}

export default function BrochurePage() {
  return <BrochureClientPage />
}

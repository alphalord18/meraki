import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Sponsor } from "@shared/schema";
import { motion } from "framer-motion";

const sponsorshipPackages = [
  {
    tier: "Platinum",
    price: "₹50,000",
    benefits: [
      "Premium logo placement on all event materials",
      "VIP access to all events",
      "Speaking opportunity at main event",
      "Social media promotion",
      "Booth space at venue"
    ]
  },
  {
    tier: "Gold",
    price: "₹30,000",
    benefits: [
      "Logo placement on event materials",
      "Access to all events",
      "Social media mentions",
      "Booth space at venue"
    ]
  },
  {
    tier: "Silver",
    price: "₹15,000",
    benefits: [
      "Logo placement on website",
      "Access to main event",
      "Social media mention"
    ]
  }
];

// Past sponsors data
const pastSponsors = [
  { id: 1, name: "TechCorp", logo: "https://picsum.photos/100?random=1" },
  { id: 2, name: "InnovateLabs", logo: "https://picsum.photos/100?random=2" },
  { id: 3, name: "FutureWorks", logo: "https://picsum.photos/100?random=3" },
  { id: 4, name: "CreativeMinds", logo: "https://picsum.photos/100?random=4" },
  { id: 5, name: "DigitalDreams", logo: "https://picsum.photos/100?random=5" },
  { id: 6, name: "GlobalTech", logo: "https://picsum.photos/100?random=6" }
];

export default function Sponsors() {
  const { data: sponsors, isLoading } = useQuery<Sponsor[]>({
    queryKey: ["/api/sponsors"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Sponsorship Opportunities</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join us in supporting the literary arts and reaching a diverse audience of students, educators, and literature enthusiasts.
        </p>
      </div>

      {/* Past Sponsors Marquee */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Past Sponsors</h2>
        <div className="relative overflow-hidden py-8 bg-gray-50">
          <div className="flex animate-marquee">
            {[...pastSponsors, ...pastSponsors].map((sponsor, index) => (
              <div
                key={`${sponsor.id}-${index}`}
                className="flex-shrink-0 mx-8"
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-16 w-16 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sponsorship Packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {sponsorshipPackages.map((pkg, index) => (
          <motion.div
            key={pkg.tier}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="text-center h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">{pkg.tier}</CardTitle>
                <div className="text-3xl font-bold text-[#2E4A7D] my-4">{pkg.price}</div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <ul className="text-left space-y-3 flex-grow">
                  {pkg.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-[#2E4A7D]">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="mt-6">
                  <Button className="w-full">Contact Us</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Current Sponsors */}
      <h2 className="text-3xl font-bold mb-8">Our Current Sponsors</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sponsors?.map((sponsor, index) => (
          <motion.div
            key={sponsor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="text-center">
              <CardHeader>
                <CardTitle>{sponsor.name}</CardTitle>
                <div className="text-sm text-gray-500 uppercase">{sponsor.tier} Sponsor</div>
              </CardHeader>
              <CardContent>
                {sponsor.logoUrl && (
                  <img
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    className="h-20 object-contain mx-auto mb-4"
                  />
                )}
                {sponsor.website && (
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2E4A7D] hover:underline"
                  >
                    Visit Website
                  </a>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 text-center bg-[#2E4A7D] text-white p-12 rounded-lg"
      >
        <h2 className="text-3xl font-bold mb-4">Interested in Sponsoring?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          We offer custom sponsorship packages tailored to your organization's needs. Contact us to discuss how we can work together.
        </p>
        <Link href="/contact">
          <Button className="bg-white text-[#2E4A7D] hover:bg-white/90">
            Get in Touch
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
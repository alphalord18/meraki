import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Sponsor } from "@shared/schema";
import { motion } from "framer-motion";

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
      <h1 className="text-4xl font-bold mb-8">Our Sponsors</h1>
      
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
    </div>
  );
}

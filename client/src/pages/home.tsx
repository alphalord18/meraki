import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="h-screen relative bg-gradient-to-br from-[#E8EAF6] to-[#F4F4F4]">
        <div className="container mx-auto h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#2E4A7D] to-[#FFC857] bg-clip-text text-transparent">
              MERAKI 2025
            </h1>
            <p className="text-2xl text-gray-700 mb-8">
              Where Creativity Meets Expression
            </p>
            <div className="flex gap-4">
              <Link href="/register">
                <Button className="bg-[#2E4A7D] hover:bg-[#2E4A7D]/90 text-white px-8 py-6">
                  Register Now
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" className="px-8 py-6">
                  View Events
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Event Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Poetry Slam",
                description: "Express yourself through verses",
                icon: "🎭"
              },
              {
                title: "Storytelling",
                description: "Weave magical narratives",
                icon: "📚"
              },
              {
                title: "Literary Debates",
                description: "Engage in intellectual discourse",
                icon: "🎤"
              }
            ].map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-[#F4F4F4] p-8 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{event.icon}</div>
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#2E4A7D] text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Join Us at Meraki 2025</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Be part of the largest literary festival celebrating creativity and expression
          </p>
          <Link href="/register">
            <Button className="bg-[#FFC857] text-black hover:bg-[#FFC857]/90 px-8 py-6">
              Register Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

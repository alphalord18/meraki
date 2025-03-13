import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Event } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">Upcoming Events</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedEvent(event)}
              className="cursor-pointer"
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className={`text-sm ${event.registrationOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {event.registrationOpen ? "Registration Open" : "Registration Closed"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedEvent(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 overflow-y-auto max-h-[90vh]"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setSelectedEvent(null)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="p-6">
                <h2 className="text-3xl font-bold mb-4">{selectedEvent.title}</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">About the Event</h3>
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Event Details</h3>
                    <div className="space-y-2">
                      <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
                      <p><strong>Category:</strong> {selectedEvent.category}</p>
                      <p><strong>Maximum Participants:</strong> {selectedEvent.maxParticipants}</p>
                      <p>
                        <strong>Registration Status:</strong>
                        <span className={selectedEvent.registrationOpen ? 'text-green-600' : 'text-red-600'}>
                          {selectedEvent.registrationOpen ? ' Open' : ' Closed'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Rules and Guidelines</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Participants must be enrolled in a recognized educational institution</li>
                      <li>Each school can register up to the maximum number of participants specified</li>
                      <li>All submissions must be original work</li>
                      <li>Time limits must be strictly followed</li>
                      <li>The judges' decision will be final</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
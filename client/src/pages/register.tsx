import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schoolFormSchema, coordinatorFormSchema, participantFormSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Event } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { generatePassword } from "@/lib/utils";

type RegistrationStep = "school" | "coordinator" | "events" | "participants" | "confirmation";

export default function Register() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("school");
  const [registrationData, setRegistrationData] = useState<{
    school: any;
    coordinator: any;
    selectedEvents: number[];
    participants: Record<number, any[]>;
  }>({
    school: null,
    coordinator: null,
    selectedEvents: [],
    participants: {}
  });

  const { toast } = useToast();

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const schoolForm = useForm({
    resolver: zodResolver(schoolFormSchema),
  });

  const coordinatorForm = useForm({
    resolver: zodResolver(coordinatorFormSchema),
  });

  const participantForm = useForm({
    resolver: zodResolver(participantFormSchema),
  });

  const handleSchoolSubmit = (data: any) => {
    setRegistrationData(prev => ({ ...prev, school: data }));
    setCurrentStep("coordinator");
  };

  const handleCoordinatorSubmit = (data: any) => {
    setRegistrationData(prev => ({ ...prev, coordinator: data }));
    setCurrentStep("events");
  };

  const handleEventSelection = (eventId: number) => {
    setRegistrationData(prev => ({
      ...prev,
      selectedEvents: prev.selectedEvents.includes(eventId)
        ? prev.selectedEvents.filter(id => id !== eventId)
        : [...prev.selectedEvents, eventId],
      participants: prev.selectedEvents.includes(eventId)
        ? Object.fromEntries(Object.entries(prev.participants).filter(([key]) => key !== eventId.toString()))
        : prev.participants
    }));
  };

  const handleParticipantSubmit = (eventId: number, data: any) => {
    setRegistrationData(prev => ({
      ...prev,
      participants: {
        ...prev.participants,
        [eventId]: [...(prev.participants[eventId] || []), data]
      }
    }));
    participantForm.reset();
  };

  const { mutate: submitRegistration, isPending } = useMutation({
    mutationFn: async (data: any) => {
      // Generate password for coordinator
      const password = generatePassword();

      // Store in Firebase
      const docRef = await addDoc(collection(db, "registrations"), {
        ...data,
        coordinator: {
          ...data.coordinator,
          password
        },
        createdAt: new Date()
      });

      // Send coordinator credentials via API
      await apiRequest("POST", "/api/send-coordinator-credentials", {
        email: data.coordinator.email,
        password
      });

      return docRef;
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Check your coordinator email for login credentials."
      });
      // Reset forms and state
      schoolForm.reset();
      coordinatorForm.reset();
      participantForm.reset();
      setRegistrationData({
        school: null,
        coordinator: null,
        selectedEvents: [],
        participants: {}
      });
      setCurrentStep("school");
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const selectedEvent = events?.find(event => 
    registrationData.selectedEvents.includes(event.id) && 
    (!registrationData.participants[event.id] || 
     registrationData.participants[event.id].length < event.maxParticipants)
  );

  const isEventCompleted = (eventId: number) => {
    const event = events?.find(e => e.id === eventId);
    return event && registrationData.participants[eventId]?.length === event.maxParticipants;
  };

  const allParticipantsAdded = registrationData.selectedEvents.every(eventId => 
    isEventCompleted(eventId)
  );

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Register for Meraki 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {currentStep === "school" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Form {...schoolForm}>
                    <form onSubmit={schoolForm.handleSubmit(handleSchoolSubmit)} className="space-y-4">
                      <FormField
                        control={schoolForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={schoolForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={schoolForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={schoolForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={schoolForm.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={schoolForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Next</Button>
                    </form>
                  </Form>
                </motion.div>
              )}

              {currentStep === "coordinator" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Form {...coordinatorForm}>
                    <form onSubmit={coordinatorForm.handleSubmit(handleCoordinatorSubmit)} className="space-y-4">
                      <FormField
                        control={coordinatorForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Coordinator Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={coordinatorForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={coordinatorForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setCurrentStep("school")}>
                          Back
                        </Button>
                        <Button type="submit">Next</Button>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              )}

              {currentStep === "events" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Select Events</h3>
                    <div className="grid gap-4">
                      {events?.map(event => (
                        <div key={event.id} className="flex items-center justify-between p-4 border rounded">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-gray-600">{event.description}</p>
                            <p className="text-sm text-gray-500">
                              Max Participants: {event.maxParticipants}
                            </p>
                          </div>
                          <Button
                            variant={registrationData.selectedEvents.includes(event.id) ? "default" : "outline"}
                            onClick={() => handleEventSelection(event.id)}
                          >
                            {registrationData.selectedEvents.includes(event.id) ? "Selected" : "Select"}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep("coordinator")}>
                        Back
                      </Button>
                      <Button
                        onClick={() => setCurrentStep("participants")}
                        disabled={registrationData.selectedEvents.length === 0}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === "participants" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {selectedEvent ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Add Participants for {selectedEvent.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Participants added: {registrationData.participants[selectedEvent.id]?.length || 0} 
                        / {selectedEvent.maxParticipants}
                      </p>

                      <Form {...participantForm}>
                        <form onSubmit={participantForm.handleSubmit(data => 
                          handleParticipantSubmit(selectedEvent.id, data)
                        )} className="space-y-4">
                          <FormField
                            control={participantForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={participantForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={participantForm.control}
                            name="grade"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Grade</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit">Add Participant</Button>
                        </form>
                      </Form>

                      <div className="flex justify-between mt-8">
                        <Button variant="outline" onClick={() => setCurrentStep("events")}>
                          Back to Events
                        </Button>
                        {allParticipantsAdded && (
                          <Button onClick={() => setCurrentStep("confirmation")}>
                            Review & Submit
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-semibold mb-4">All participants added!</h3>
                      <Button onClick={() => setCurrentStep("confirmation")}>
                        Review & Submit
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {currentStep === "confirmation" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">School Details</h3>
                      <div className="bg-gray-50 p-4 rounded">
                        <p><strong>Name:</strong> {registrationData.school.name}</p>
                        <p><strong>Address:</strong> {registrationData.school.address}</p>
                        <p><strong>City:</strong> {registrationData.school.city}</p>
                        <p><strong>State:</strong> {registrationData.school.state}</p>
                        <p><strong>Pincode:</strong> {registrationData.school.pincode}</p>
                        <p><strong>Phone:</strong> {registrationData.school.phone}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Coordinator Details</h3>
                      <div className="bg-gray-50 p-4 rounded">
                        <p><strong>Name:</strong> {registrationData.coordinator.name}</p>
                        <p><strong>Email:</strong> {registrationData.coordinator.email}</p>
                        <p><strong>Phone:</strong> {registrationData.coordinator.phone}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Selected Events & Participants</h3>
                      {events?.filter(event => registrationData.selectedEvents.includes(event.id))
                        .map(event => (
                          <div key={event.id} className="bg-gray-50 p-4 rounded mb-4">
                            <h4 className="font-medium mb-2">{event.title}</h4>
                            <div className="space-y-2">
                              {registrationData.participants[event.id]?.map((participant, index) => (
                                <div key={index} className="pl-4 border-l-2 border-gray-300">
                                  <p><strong>Name:</strong> {participant.name}</p>
                                  <p><strong>Email:</strong> {participant.email}</p>
                                  <p><strong>Grade:</strong> {participant.grade}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep("participants")}>
                        Back
                      </Button>
                      <Button 
                        onClick={() => submitRegistration(registrationData)}
                        disabled={isPending}
                      >
                        {isPending ? "Submitting..." : "Submit Registration"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
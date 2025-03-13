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

type RegistrationStep = "school" | "coordinator" | "events" | "participants" | "confirmation";

export default function Register() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("school");
  const [registrationData, setRegistrationData] = useState({
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

  const handleSchoolSubmit = (data) => {
    setRegistrationData(prev => ({ ...prev, school: data }));
    setCurrentStep("coordinator");
  };

  const handleCoordinatorSubmit = (data) => {
    setRegistrationData(prev => ({ ...prev, coordinator: data }));
    setCurrentStep("events");
  };

  const handleEventSelection = (eventId: number) => {
    setRegistrationData(prev => ({
      ...prev,
      selectedEvents: prev.selectedEvents.includes(eventId)
        ? prev.selectedEvents.filter(id => id !== eventId)
        : [...prev.selectedEvents, eventId]
    }));
  };

  const { mutate: submitRegistration, isPending } = useMutation({
    mutationFn: async (data) => {
      await apiRequest("POST", "/api/register", data);
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Check your coordinator email for login credentials."
      });
      // Reset forms and state
      schoolForm.reset();
      coordinatorForm.reset();
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
                      {/* Add other school form fields */}
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
                      {/* Add other coordinator form fields */}
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

              {/* Add participants step */}
              {/* Add confirmation step */}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
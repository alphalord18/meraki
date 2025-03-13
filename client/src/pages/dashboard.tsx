import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { schoolFormSchema, coordinatorFormSchema } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Add events query
  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const schoolForm = useForm({
    resolver: zodResolver(schoolFormSchema),
  });

  const coordinatorForm = useForm({
    resolver: zodResolver(coordinatorFormSchema),
  });

  useEffect(() => {
    const data = localStorage.getItem("registrationData");
    if (!data) {
      setLocation("/login");
      return;
    }

    const parsed = JSON.parse(data);
    setRegistrationData(parsed);

    // Set form default values
    schoolForm.reset(parsed.school);
    coordinatorForm.reset(parsed.coordinator);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("registrationData");
    setLocation("/login");
  };

  const handleSave = async (type: "school" | "coordinator") => {
    setIsSaving(true);
    try {
      const form = type === "school" ? schoolForm : coordinatorForm;
      const values = form.getValues();

      const docRef = doc(db, "registrations", registrationData.id);
      await updateDoc(docRef, {
        [type]: values
      });

      // Update local storage
      const updated = {
        ...registrationData,
        [type]: values
      };
      localStorage.setItem("registrationData", JSON.stringify(updated));
      setRegistrationData(updated);

      toast({
        title: "Changes Saved",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} details updated successfully.`
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!registrationData) {
    return null;
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Registration Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <div className="space-y-8">
          {/* School Details */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>School Details</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...schoolForm}>
                  <form onSubmit={schoolForm.handleSubmit(() => handleSave("school"))} className="space-y-4">
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
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {registrationData.school.name}</p>
                  <p><strong>Address:</strong> {registrationData.school.address}</p>
                  <p><strong>City:</strong> {registrationData.school.city}</p>
                  <p><strong>State:</strong> {registrationData.school.state}</p>
                  <p><strong>Pincode:</strong> {registrationData.school.pincode}</p>
                  <p><strong>Phone:</strong> {registrationData.school.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Participants */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Events & Participants</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(registrationData.participants).map(([eventId, participants]: [string, any[]]) => {
                // Find the event details
                const event = events?.find(e => e.id === parseInt(eventId));
                return (
                  <div key={eventId} className="mb-6">
                    <h3 className="font-semibold mb-2">
                      Event: {event?.title || `Event ${eventId}`}
                    </h3>
                    <div className="space-y-4">
                      {participants.map((participant, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded">
                          <p><strong>Name:</strong> {participant.name}</p>
                          <p><strong>Email:</strong> {participant.email}</p>
                          <p><strong>Grade:</strong> {participant.grade}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
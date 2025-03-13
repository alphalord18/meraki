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
import { schoolFormSchema, coordinatorFormSchema, participantFormSchema } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingParticipant, setIsEditingParticipant] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

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
  
  const participantForm = useForm({
    resolver: zodResolver(participantFormSchema),
  });

  useEffect(() => {
    const data = localStorage.getItem("registrationData");
    if (!data) {
      setLocation("/login");
      return;
    }

    const parsed = JSON.parse(data);
    
    // If participants are not loaded yet, set a default empty array
    if (!parsed.participants) {
      parsed.participants = [];
    }
    
    setRegistrationData(parsed);

    // Set form default values
    schoolForm.reset(parsed.school);
    coordinatorForm.reset(parsed.coordinator);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("registrationData");
    setLocation("/login");
  };

  const handleSave = async (type: "school" | "coordinator" | "participant") => {
    setIsSaving(true);
    try {
      let values;
      let docRef;
      let updated;
      
      if (type === "participant" && selectedParticipant) {
        values = participantForm.getValues();
        docRef = doc(db, "participants", selectedParticipant.id);
        await updateDoc(docRef, values);
        
        // Update local storage - find and replace the participant
        const updatedParticipants = registrationData.participants.map((p: any) => 
          p.id === selectedParticipant.id ? { ...p, ...values } : p
        );
        
        updated = {
          ...registrationData,
          participants: updatedParticipants
        };
        
        setIsEditingParticipant(false);
      } else {
        // Handle school/coordinator as before
        const form = type === "school" ? schoolForm : coordinatorForm;
        values = form.getValues();
        
        docRef = doc(db, "registrations", registrationData.id);
        await updateDoc(docRef, {
          [type]: values
        });
        
        updated = {
          ...registrationData,
          [type]: values
        };
        
        setIsEditing(false);
      }
      
      // Update local storage
      localStorage.setItem("registrationData", JSON.stringify(updated));
      setRegistrationData(updated);

      toast({
        title: "Changes Saved",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} details updated successfully.`
      });
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
  
  const handleEditParticipant = (participant: any) => {
    setSelectedParticipant(participant);
    participantForm.reset(participant);
    setIsEditingParticipant(true);
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

          {/* Participants Section */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Participants</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditingParticipant && selectedParticipant ? (
                <Form {...participantForm}>
                  <form onSubmit={participantForm.handleSubmit(() => handleSave("participant"))} className="space-y-4">
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
                            <Input {...field} />
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
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditingParticipant(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <>
                  {registrationData.participants && registrationData.participants.length > 0 ? (
                    <div className="space-y-4">
                      {registrationData.participants.map((participant: any, index: number) => (
                        <div key={index} className="border p-4 rounded-md">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{participant.name}</h3>
                              <p className="text-sm text-gray-500">{participant.email}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditParticipant(participant)}
                            >
                              Edit
                            </Button>
                          </div>
                          <div className="text-sm">
                            <p><strong>Grade:</strong> {participant.grade}</p>
                            {participant.details && Object.entries(participant.details).map(([key, value]: [string, any]) => (
                              <p key={key}><strong>{key}:</strong> {value.toString()}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No participants registered yet.</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
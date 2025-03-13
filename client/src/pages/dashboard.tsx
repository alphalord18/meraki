import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { schoolFormSchema, coordinatorFormSchema, participantFormSchema } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import type { Event, School } from "@shared/schema";
import axios from "axios";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingParticipant, setIsEditingParticipant] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [schoolData, setSchoolData] = useState<School | null>(null);

  // Add events query
  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const schoolForm = useForm({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: ""
    }
  });

  // Load school data
  useEffect(() => {
    const fetchSchoolData = async () => {
      if (registrationData?.schoolId) {
        try {
          const schoolRef = doc(db, "schools", registrationData.schoolId);
          const schoolSnap = await getDoc(schoolRef);

          if (schoolSnap.exists()) {
            const data = { id: schoolSnap.id, ...schoolSnap.data() } as School;
            setSchoolData(data);
            schoolForm.reset(data);
          }
        } catch (error) {
          console.error("Error fetching school data:", error);
        }
      }
    };

    fetchSchoolData();
  }, [registrationData]);

  // Function to update school details
  const updateSchoolDetails = async (data) => {
    try {
      if (registrationData?.schoolId) {
        const schoolRef = doc(db, "schools", registrationData.schoolId);
        await updateDoc(schoolRef, {
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          phone: data.phone
        });

        toast({
          title: "Success",
          description: "School details updated successfully!",
        });

        // Update local state
        setSchoolData({ id: registrationData.schoolId, ...data });
      }
    } catch (error) {
      console.error("Error updating school data:", error);
      toast({
        title: "Error",
        description: "Failed to update school details.",
        variant: "destructive",
      });
    }
  };

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

  const handleEditSchool = () => {
    setIsEditing(true);
    if (schoolData) {
      schoolForm.reset(schoolData);
    }
  };

  const handleSaveSchool = async (data: any) => {
    if (!registrationData?.schoolId) return;

    setIsSaving(true);
    try {
      // Update in Firebase
      const schoolRef = doc(db, "schools", registrationData.schoolId);
      await updateDoc(schoolRef, data);

      // Update in API if available
      try {
        await axios.put(`/api/schools/${registrationData.schoolId}`, data);
      } catch (apiError) {
        console.warn("API update failed, but Firebase update succeeded:", apiError);
      }

      setSchoolData({ ...schoolData, ...data } as School);
      setIsEditing(false);

      toast({
        title: "School Updated",
        description: "School details have been updated successfully."
      });
    } catch (error) {
      console.error("Error updating school:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update school details. Please try again.",
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

        {/* School Details Card */}
        <Card className="mb-8 bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>School Details</CardTitle>
            {!isEditing && (
              <Button size="sm" onClick={handleEditSchool}>
                Edit School Details
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Form {...schoolForm}>
                <form onSubmit={schoolForm.handleSubmit(handleSaveSchool)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
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
                        <FormItem className="md:col-span-2">
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
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                <div>
                  <dt className="text-sm text-gray-500">School Name</dt>
                  <dd className="font-medium">{schoolData?.name || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Phone</dt>
                  <dd className="font-medium">{schoolData?.phone || "-"}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm text-gray-500">Address</dt>
                  <dd className="font-medium">{schoolData?.address || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">City</dt>
                  <dd className="font-medium">{schoolData?.city || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">State</dt>
                  <dd className="font-medium">{schoolData?.state || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Pincode</dt>
                  <dd className="font-medium">{schoolData?.pincode || "-"}</dd>
                </div>
              </dl>
            )}
          </CardContent>
        </Card>


        <div className="space-y-8">
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mt-2"
                            onClick={() => handleEditParticipant(participant)}
                          >
                            Edit Details
                          </Button>
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
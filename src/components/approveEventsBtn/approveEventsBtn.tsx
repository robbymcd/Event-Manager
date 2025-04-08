import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "../ui/checkbox";
import { useUser } from "@/app/context/userContext";

import styles from "./approveEventsBtn.module.css";

interface Event {
  id: number;
  name: string;
  approved: boolean;
}

interface FormSchema {
  eventIds: number[];
}

const formSchema = z.object({
  eventIds: z.array(z.number()).min(1, {
    message: "At least one event must be selected to approve",
  }),
});

export default function ApproveEventsBtn() {
  const [events, setEvents] = useState<Event[]>([]);
  const { user } = useUser(); // Assuming user context
  const isSuperAdmin = user?.role === "super-admin";

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("/api/events");
      const data = await response.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventIds: [],
    },
    mode: "onSubmit",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/events/approve", { // Updated path here
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventIds: values.eventIds,
        }),
      });
  
      if (response.ok) {
        // Update the state to reflect the approved events
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            values.eventIds.includes(event.id)
              ? { ...event, approved: true }
              : event
          )
        );
        console.log("Events approved successfully");
      } else {
        console.error("Failed to approve events");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }
  

  const filteredEvents = events.filter(
    (event) => isSuperAdmin || event.approved
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={styles.button}>
          Approve Events
        </Button>
      </DialogTrigger>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle>Approve Events</DialogTitle>
          <DialogDescription>
            Select the events you want to approve.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className={styles.scrollArea}>
              <FormField
                control={form.control}
                name="eventIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Events</FormLabel>
                    <div className={styles.checkboxGroup}>
                      {filteredEvents.map((event) => (
                        <FormControl key={event.id}>
                          <div className={styles.checkboxItem}>
                            <Checkbox
                              className={styles.checkbox}
                              checked={field.value.includes(event.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, event.id]);
                                } else {
                                  field.onChange(
                                    field.value.filter((id) => id !== event.id)
                                  );
                                }
                              }}
                            />
                            <FormLabel htmlFor={`event-${event.id}`} className="ml-2">
                              {event.name}
                            </FormLabel>
                          </div>
                        </FormControl>
                      ))}
                      {filteredEvents.length === 0 && (
                        <p className={styles.loadingText}>No events available</p>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ScrollArea>
            <Button type="submit" className={styles.submitButton}>
              Approve Selected Events
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styles from "./createEventBtn.module.css";
import { fromTheme } from "tailwind-merge";
import { useUser } from "@/app/context/userContext";
import { toast } from "sonner";

interface FormSchema {
  name: string;
  category: "public" | "private" | "rso";
  date: string;
  event_time: string;
  location: string;
  contact_phone: string;
  contact_email: string;
  rso: string;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Event name is required" }),
  category: z.string().min(1, { message: "Event category is required" }),
  date: z.string().min(1, { message: "Event date is required" }),
  event_time: z.string().min(1, { message: "Event time is required" }),
  location: z.string().min(1, { message: "Event location is required" }),
  contact_phone: z.string().optional(),
  contact_email: z.string().email({ message: "Invalid email address" }).optional(),
  rso: z.string().optional(),
});

export default function CreateEventBtn() {

  const { user } = useUser();

  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      date: "",
      event_time: "",
      location: "",
      contact_phone: "",
      contact_email: "",
      rso: "",
    },
  });

  // Submit function that sends the form data to API
  async function onSubmit(values: z.infer<typeof formSchema>) {
        const dateStr = values.date;
        const timeStr = values.event_time;

        // Combine date and time into a single string
        const formattedDateTimeStr = `${dateStr}T${timeStr}:00`; // Adds the time part with a "T" separator

        // Create a new Date object using the combined string
        const eventDateTime = new Date(formattedDateTimeStr);

        // Convert to ISO string (can be used for PostgreSQL)
        const formattedTimestamp = eventDateTime.toISOString();

        const { date, ...valuesWithoutDate } = values;

        const universityId = user?.university || null;

        const eventData = {
            ...valuesWithoutDate,
            event_time: formattedTimestamp,  // Send the combined timestamp to the server
            university: universityId,
        }

        try {
            console.log("Submitting event data:", eventData);

            // Send eventData to the API
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Failed with status ${response.status}:`, errorText);
              toast.error("Room already being used at this time");
            }

            const responseData = await response.json();
            console.log('Event created successfully:', responseData);
            setOpen(false);
            form.reset();
        } catch (error) {
            console.error('Failed to create event:', error);
        }
    }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={styles.button}>
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle>Create an Event</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input className={styles.input} placeholder="Enter event name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className={styles.selectTrigger}>
                        <SelectValue placeholder="Select event category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className={styles.selectGroup}>
                          <SelectItem className={styles.selectItem} value="public">
                            Public
                          </SelectItem>
                          <SelectItem className={styles.selectItem} value="private">
                            Private
                          </SelectItem>
                          <SelectItem className={styles.selectItem} value="rso">
                            RSO
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("category") === "rso" && (
              <FormField
                control={form.control}
                name="rso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RSO</FormLabel>
                    <FormControl>
                      <Input className={styles.input} placeholder="Enter RSO name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Date</FormLabel>
                  <FormControl>
                    <Input className={styles.input} type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Time</FormLabel>
                  <FormControl>
                    <Input className={styles.input} type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Location</FormLabel>
                  <FormControl>
                    <Input className={styles.input} placeholder="Enter event location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input
                      className={styles.input}
                      type="tel"
                      placeholder="Enter contact phone number"
                      value={field.value}
                      onChange={(e) => {
                        // Get only the digits
                        const digits = e.target.value.replace(/\D/g, "");

                        // Format the phone number
                        let formattedValue = "";
                        if (digits.length <= 3) {
                          formattedValue = digits;
                        } else if (digits.length <= 6) {
                          formattedValue = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
                        } else {
                          formattedValue = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
                        }

                        // Update the field value
                        field.onChange(formattedValue);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input
                      className={styles.input}
                      type="email"
                      placeholder="Enter contact email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className={styles.submitButton} disabled={!form.formState.isValid}>
              Create Event
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

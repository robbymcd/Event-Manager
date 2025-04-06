import React, { useState, useEffect, Fragment } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "../ui/scroll-area"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { RadioGroup } from "@radix-ui/react-radio-group"
import { Checkbox } from "../ui/checkbox"
import { z } from "zod";

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RadioGroupItem } from "../ui/radio-group"
import { Textarea } from "../ui/textarea"

import styles from './createEventBtn.module.css'

interface FormSchema {
    name: string;
    description: string;
    category: string;
    date: string;
    event_time: string;
    location: string;
    contact_phone: string;
    contact_email: string;
    rso: string;
    university: string;
}

const formSchema = z.object({
    name: z.string().min(1, { message: "Event name is required" }),
    description: z.string().min(1, { message: "Event description is required" }),
    category: z.string().min(1, { message: "Event category is required" }),
    date: z.string().min(1, { message: "Event date is required" }),
    event_time: z.string().min(1, { message: "Event time is required" }),
    location: z.string().min(1, { message: "Event location is required" }),
    contact_phone: z.string().optional(),
    contact_email: z.string().email({ message: "Invalid email address" }).optional(),
    rso: z.string().min(1, { message: "RSO is required" }),
    university: z.string().min(1, { message: "University is required" }),
});



export default function CreateEventBtn() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            category: "",
            date: "",
            event_time: "",
            location: "",
            contact_phone: "",
            contact_email: "",
            rso: "",
            university: ""
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log("Submitting event data:", values);
        } catch (error) {
            console.error("Failed to create event:", error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className={styles.button}>Create Event</Button>
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
                                        <Input placeholder="Enter event name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter event description" {...field} />
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
                                        <Input placeholder="Enter event category" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
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
                                        <Input type="time" {...field} />
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
                                        <Input placeholder="Enter event location" {...field} />
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
                                    <FormLabel>Contact Phone (optional)</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="Enter contact phone number" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
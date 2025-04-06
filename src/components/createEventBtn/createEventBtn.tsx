import React from "react"
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
import { z } from "zod";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "../ui/textarea"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import styles from './createEventBtn.module.css'

interface FormSchema {
    name: string;
    category: "public" | "private" | "rso";
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
        const dateStr = values.date;
        const timeStr = values.event_time; 
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hours, minutes] = timeStr.split(':').map(Number);
        const eventDateTime = new Date(year, month - 1, day, hours, minutes);
        const formattedTimestamp = eventDateTime.toISOString();
        const eventData = {
            ...values,
            timestamp: formattedTimestamp,
        }
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
                                                        <SelectItem className={styles.selectItem} value="public">Public</SelectItem>
                                                        <SelectItem className={styles.selectItem} value="private">Private</SelectItem>
                                                        <SelectItem className={styles.selectItem} value="rso">RSO</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                        </Select>
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
                                            const digits = e.target.value.replace(/\D/g, '');

                                            // Format the phone number
                                            let formattedValue = '';
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
                                        <Input className={styles.input} type="email" placeholder="Enter contact email address" {...field} />
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
    )
}
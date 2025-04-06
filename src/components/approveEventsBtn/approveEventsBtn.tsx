import React, { useEffect, useState } from "react"
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
import { Checkbox } from "../ui/checkbox"

import styles from "./approveEventsBtn.module.css"
import { Label } from "../ui/label"

interface Event {
    id: number;
    name: string;
}

interface FormSchema {
    eventIds: number[];
}

const formSchema = z.object({
    eventIds: z.array(z.number()).min(1, {
        message: "At least one event must be selected to approve"
    })
});

export default function ApproveEventsBtn() {

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const testEvents = [{id: 0, name: 'Event 1'}, {id: 1, name: 'Event 2'}, {id: 2, name: 'Event 3'}, {id: 3, name: 'Event 4'}, {id: 4, name: 'Event 5'}];
        setEvents(testEvents);
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            eventIds: []
        },
        mode: "onSubmit",
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log("Submitting form with values:", values);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

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
                                            {events.map((event) => (
                                                <FormControl key={event.id}>
                                                    <div className={styles.checkboxItem}>
                                                        <Checkbox
                                                            className={styles.checkbox}
                                                            checked={field.value.includes(event.id)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    field.onChange([...field.value, event.id]);
                                                                } else {
                                                                    field.onChange(field.value.filter(id => id !== event.id));
                                                                }
                                                            }}
                                                        />
                                                        <FormLabel htmlFor={`event-${event.id}`} className="ml-2">
                                                            {event.name}
                                                        </FormLabel>
                                                    </div>
                                                </FormControl>
                                            ))}
                                            {events.length === 0 && <p className={styles.loadingText}>Loading events...</p>}
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
    )
}
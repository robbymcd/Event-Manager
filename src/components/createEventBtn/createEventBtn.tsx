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
    rso: number;
    university: number;
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
    
})



export default function CreateEventBtn() {
    return (
        <div>
            
        </div>
    )
}
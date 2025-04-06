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

import styles from './joinRSOBtn.module.css'
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RadioGroupItem } from "../ui/radio-group"
import { Textarea } from "../ui/textarea"

interface FormSchema {
  formType: string;
  rsoName?: string; 
  rsoDesc?: string; 
  rsoCat?: string;
  rsos: number[]; 
}

const formSchema = z.discriminatedUnion("formType", [
  z.object({
    formType: z.literal("join"),
    rsoName: z.string().optional(),
    rsoDesc: z.string().optional(),
    rsoCat: z.string().optional(),
    rsos: z.array(z.number()).min(1, {
      message: "At least one RSO must be selected to join"
    })
  }),
  z.object({
    formType: z.literal("create"),
    rsoName: z.string().min(1, { message: "RSO name is required" }),
    rsoDesc: z.string().min(1, { message: "RSO description is required" }),
    rsoCat: z.string().min(1, { message: "RSO category is required" }),
    rsos: z.array(z.number()).optional()
  })
]);

export default function JoinRSOBtn() {

  const [rsos, setRsos] = useState<Array<{ id: number; name: string }>>([]);

  const fetchRSOs = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/rsos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch RSOs");
      }

      const data = await response.json();
      setRsos(data.map((rso: { id: number; name: string }) => ({ 
        id: rso.id, 
        name: rso.name || `RSO ${rso.id}`
      })));
    } catch (error) {
      console.error("Failed to fetch RSOs:", error);
    }
  }

  useEffect(() => {
    fetchRSOs();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formType: undefined,
      rsoName: "",
      rsoDesc: "",
      rsoCat: "",
      rsos: [],
    },
    mode: "onBlur",
  })

  const formType = useWatch({
    control: form.control,
    name: "formType",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(
        formType === "create" ? "http://localhost:3000/api/rsos/create" : "http://localhost:3000/api/rsos/join",)
      console.log("Submitting form with values:", values);
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  }

  return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className={styles.button}>Join/Create RSO</Button>
        </DialogTrigger>
        <DialogContent className={styles.dialogContent}>
          <DialogHeader>
            <DialogTitle>Join or Create an RSO</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="formType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Select an option</FormLabel>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      className={styles.radioGroup}  
                    >
                      <FormItem className={styles.radioItem}>
                        <FormControl>
                          <RadioGroupItem value="join" />
                        </FormControl>
                        <FormLabel>Join</FormLabel>
                      </FormItem>
                      <FormItem className={styles.radioItem}>
                        <FormControl>
                          <RadioGroupItem value="create" />
                        </FormControl>
                        <FormLabel>Create</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormItem>
                )}
              />
              {formType === "join" && (
                <FormField 
                  control={form.control}
                  name="rsos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select RSO to Join</FormLabel>
                      <ScrollArea className={styles.scrollArea}>
                        {rsos.length === 0 && <p>Loading RSOs...</p>}
                        {rsos.map((rso) => (
                          <div key={rso.id} className={`${styles.rsoOption} mb-2`}>
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={(field.value ?? []).includes(rso.id)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...(field.value ?? []), rso.id]
                                      : (field.value ?? []).filter(id => id !== rso.id);
                                    field.onChange(newValue);
                                  }}
                                  className={styles.checkbox}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{rso.name}</FormLabel>
                            </FormItem>
                          </div>
                        ))}
                      </ScrollArea>
                      <FormMessage />
                    </FormItem>
                  )}
                
                />

              )}
              {formType === "create" && (
                <Fragment>
                  <FormField
                    control={form.control}
                    name="rsoName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">RSO Name</FormLabel>
                        <FormControl>
                          <Input className={styles.input} placeholder="Enter RSO name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rsoDesc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">RSO Description</FormLabel>
                        <FormControl>
                          <Textarea
                            className={styles.textArea}
                            placeholder="Enter RSO description"
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rsoCat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">RSO Category</FormLabel>
                        <FormControl>
                          <Input
                            className={styles.input}
                            placeholder="Enter RSO category"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Fragment>
              )}
              <Button type="submit" className={styles.submitButton} disabled={!form.formState.isValid}>
                {formType === "join" ? "Join RSO" : "Create RSO"}
               </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  )
}
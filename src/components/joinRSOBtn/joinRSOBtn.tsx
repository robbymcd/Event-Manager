import React, { Fragment, useState, useEffect } from "react";
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
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Checkbox } from "../ui/checkbox";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import { useUser } from "@/app/context/userContext";

import styles from './joinRSOBtn.module.css';

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
      message: "At least one RSO must be selected to join",
    }),
  }),
  z.object({
    formType: z.literal("leave"),
    rsoName: z.string().optional(),
    rsoDesc: z.string().optional(),
    rsoCat: z.string().optional(),
    rsos: z.array(z.number()).min(1, {
      message: "At least one RSO must be selected to leave",
    }),
  }),
  z.object({
    formType: z.literal("create"),
    rsoName: z.string().min(1, { message: "RSO name is required" }),
    rsoDesc: z.string().min(1, { message: "RSO description is required" }),
    rsoCat: z.string().min(1, { message: "RSO category is required" }),
    rsos: z.array(z.number()).optional(),
  }),
]);

export default function JoinRSOBtn() {
  const { user } = useUser(); // Access user from context
  const [rsos, setRsos] = useState<Array<{ id: number; name: string }>>([]);
  const [myRsos, setMyRsos] = useState<Array<{ id: number; name: string }>>([]);
  const [open, setOpen] = useState(false);

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
      setRsos(
        data.map((rso: { id: number; name: string }) => ({
          id: rso.id,
          name: rso.name || `RSO ${rso.id}`,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch RSOs:", error);
    }
  };

  const fetchMyRSOs = async () => {
    try {
      if (!user) return;
      const response = await fetch(`http://localhost:3000/api/rsos/my-rsos?id=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      setMyRsos(
        data.map((rso: { id: number; name: string }) => ({
          id: rso.id,
          name: rso.name || `RSO ${rso.id}`,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch users RSOs:", error);
    }
  };

  const leaveRSOs = async () => {
    const leavingRSOs = form.getValues("rsos");
    try {
      const response = await fetch(`http://localhost:3000/api/rsos/leave?id=${user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to leave RSOs");
      }

      const data = await response.json();
      console.log("Left RSOs successfully:", data);
    } catch (error) {
      console.error("Failed to leave RSOs:", error);
    }
  }

  useEffect(() => {
    fetchRSOs();
    fetchMyRSOs();
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
  });

  const formType = useWatch({
    control: form.control,
    name: "formType",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let endpoint = "";
      switch (formType) {
        case "create":
          endpoint = "http://localhost:3000/api/rsos/create";
          break;
        case "join":
          endpoint = "http://localhost:3000/api/rsos/join";
          break;
        case "leave":
          endpoint = "http://localhost:3000/api/rsos/leave";
          break;
      }
  

      // Send user ID and university ID with the payload
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userId: user?.id,  // Include user ID
          universityId: user?.university, // Include university ID
          rsosIds: values.rsos
        }),
      });
  
      if (!response.ok) {
        throw new Error("Submission failed");
      }
  
      const data = await response.json();
      console.log("Form submitted successfully:", data);
      form.reset();
      setOpen(false);
      if (formType === "create") {
        if (user) {
          user.role = "admin";
        }
        myRsos.push({ id: data.rsoId, name: data.rsoName });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={styles.button}>
          Manage RSOs
        </Button>
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
                    <FormItem className={styles.radioItem}>
                      <FormControl>
                        <RadioGroupItem value="leave" />
                      </FormControl>
                      <FormLabel>Leave</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormItem>
              )}
            />
            {(formType === "join" || formType === "leave") && (
              <FormField
                control={form.control}
                name="rsos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select RSO to {formType === "join" ? "Join" : "Leave"}</FormLabel>
                    <ScrollArea className={styles.scrollArea}>
                      {/* Display loading if array is empty */}
                      {(formType === "join" ? rsos : myRsos).length === 0 && (
                        <p>Loading {formType === "join" ? "available RSOs" : "your RSOs"}...</p>
                      )}

                      {/* Map through appropriate array based on formType */}
                      {(formType === "join" ? rsos : myRsos).map((rso) => (
                        <div key={rso.id} className={`${styles.rsoOption} mb-2`}>
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={(field.value ?? []).includes(rso.id)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value ?? []), rso.id]
                                    : (field.value ?? []).filter((id) => id !== rso.id);
                                  field.onChange(newValue);
                                }}
                                className={styles.checkbox}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{rso.name}</FormLabel>
                          </FormItem>
                        </div>
                      ))}

                      {/* Show message when no RSOs are available */}
                      {formType === "join" && rsos.length === 0 && (
                        <p>No RSOs available to join</p>
                      )}
                      {formType === "leave" && myRsos.length === 0 && (
                        <p>You are not a member of any RSOs</p>
                      )}
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
                        <Input
                          className={styles.input}
                          placeholder="Enter RSO name"
                          {...field}
                        />
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
            <Button
              type="submit"
              className={styles.submitButton}
              disabled={!form.formState.isValid}
            >
              {formType === "join" 
                ? "Join RSO" 
                : formType === "leave" 
                  ? "Leave RSO" 
                  : "Create RSO"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

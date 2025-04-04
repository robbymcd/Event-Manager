"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import { Fragment } from "react";
import styles from "./page.module.css";

interface FormSchema {
  email: string;
  password: string;
  confirmPassword: string;
  university: string;
  userType: string;
  rso?: string;
  rsoDescription?: string;
  rsoCategory?: string;
  image?: FileList;
  location?: string;
  uniDescription?: string;
  numStudents?: number;
}

const formSchema: z.ZodType<FormSchema> = z
  .object({
    email: z.string().email().endsWith(".edu", {
      message: "Email must be a valid school email address",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string(),
    university: z.string().min(1, {
      message: "Must enter a university",
    }),
    userType: z.enum(["student", "admin", "super-admin"], {
      message: "You must select a user type",
    }),
    rso: z.string().optional(),
    rsoDescription: z
      .string()
      .max(500, {
        message: "Description must be less than 500 characters",
      })
      .optional(),
    rsoCategory: z.string().optional(),
    image: z
      .any()
      .optional()
      .refine(
        (files) => !files || files.length === 0 || files[0]?.size <= 5000000,
        {
          message: "Image must be less than 5MB",
        }
      )
      .refine(
        (files) => {
          if (!files || files.length === 0) {
            return true;
          }
          const file = files[0];
          const validTypes = ["image/jpeg", "image/png", "image/jpg"];
          return validTypes.includes(file.type);
        },
        {
          message: "File must be a valid image type",
        }
      ),
    location: z
      .string()
      .min(1, {
        message: "Must enter a location",
      })
      .optional(),
    uniDescription: z
      .string()
      .min(1, {
        message: "Must enter a university description",
      })
      .optional(),
    numStudents: z
      .number()
      .min(1, {
        message: "Must enter the correct number of students",
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.userType !== "admin" || !!data.rso, {
    message: "You must enter an RSO",
    path: ["rso"],
  })
  .refine((data) => data.userType !== "admin" || !!data.rsoDescription, {
    message: "You must enter an RSO description",
    path: ["rsoDescription"],
  })
  .refine((data) => data.userType !== "admin" || !!data.rsoCategory, {
    message: "You must enter an RSO category",
    path: ["rsoCategory"],
  });

export default function SignupPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      university: "",
      userType: "",
      rso: "",
      rsoDescription: "",
      rsoCategory: "",
      image: undefined,
      location: "",
      uniDescription: "",
      numStudents: 0,
    },
    mode: "onBlur",
  });

  const userType = useWatch({
    control: form.control,
    name: "userType",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Signup successful");
    form.reset();
  }

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={styles.form}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className={styles.input}
                        type="text"
                        placeholder="Enter your email here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className={styles.input}
                        type="password"
                        placeholder="Enter your password here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        className={styles.input}
                        type="password"
                        placeholder="Enter your password again"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University</FormLabel>
                    <FormControl>
                      <Input
                        className={styles.input}
                        type="text"
                        placeholder="Enter your university"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select User Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormItem className={styles.radioItem}>
                          <FormControl>
                            <RadioGroupItem value="student" />
                          </FormControl>
                          <FormLabel>Student</FormLabel>
                        </FormItem>
                        <FormItem className={styles.radioItem}>
                          <FormControl>
                            <RadioGroupItem value="admin" />
                          </FormControl>
                          <FormLabel>Admin</FormLabel>
                        </FormItem>
                        <FormItem className={styles.radioItem}>
                          <FormControl>
                            <RadioGroupItem value="super-admin" />
                          </FormControl>
                          <FormLabel>Super Admin</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {userType == "admin" && (
                <Fragment>
                  <FormField
                    control={form.control}
                    name="rso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RSO</FormLabel>
                        <FormControl>
                          <Input
                            className={styles.input}
                            type="text"
                            placeholder="Enter your RSO"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rsoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RSO Description</FormLabel>
                        <FormControl>
                          <Textarea
                            className={styles.textArea}
                            maxLength={500}
                            placeholder="Enter a description of your RSO "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rsoCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RSO Category</FormLabel>
                        <FormControl>
                          <Input
                            className={styles.input}
                            type="text"
                            placeholder="Enter a category for your RSO "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Upload Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            className={styles.imgInput}
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files?.length) {
                                onChange(files);
                              }
                            }}
                            {...fieldProps}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Fragment>
              )}
              {userType == "super-admin" && (
                <Fragment>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University Location</FormLabel>
                        <FormControl>
                          <Input
                            className={styles.input}
                            type="text"
                            placeholder="Enter your university location"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="uniDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University Location</FormLabel>
                        <FormControl>
                          <Input
                            className={styles.input}
                            type="text"
                            placeholder="Enter your university location"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numStudents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Students</FormLabel>
                        <FormControl>
                          <Input
                            className={styles.input}
                            type="number"
                            placeholder="Number of students"
                            onChange={(e) => {
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : parseInt(e.target.value, 10)
                              );
                            }}
                            onBlur={field.onBlur}
                            value={field.value === undefined ? "" : field.value}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Upload Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            className={styles.imgInput}
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files?.length) {
                                onChange(files);
                              }
                            }}
                            {...fieldProps}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Fragment>
              )}
              <Button className={styles.button} type="submit">
                Submit
              </Button>
            </form>
          </Form>
          <div className={styles.footer}>
            <p>Already have an account?</p>
            <a href="/">Sign in</a>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}

"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { aircraftFormSchema } from "@/schema/aircraft.schema";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PerformanceResult from "./PerformanceResult";
import { aircraftFormFields } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function AircraftForm() {
  const [inputs, setInputs] = useState<z.infer<typeof aircraftFormSchema>>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof aircraftFormSchema>>({
    resolver: zodResolver(aircraftFormSchema),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof aircraftFormSchema>) {
    try {
      setIsSubmitting(true);
      const parsedValues = aircraftFormSchema.parse(values);
      toast({
        title: "Performance Study Calculated.",
        // description: <pre>{JSON.stringify(values, null, 2)}</pre>,
      });
      setInputs(values);
    } catch (error) {
      console.log({ error });
      toast({
        variant: "destructive",
        title: String(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex justify-center flex-wrap gap-2">
            {aircraftFormFields.map((item, index) => (
              <FormField
                key={index}
                control={form.control}
                name={item.name as any}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={item.placeholder}
                        className="w-[235px]"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <Button type="submit" className="mx-auto" disabled={isSubmitting}>
            <Loader2
              size={20}
              className={`animate-spin ${isSubmitting ? "inline" : "hidden"}`}
            />
            <p className="mx-2">Get Flight Performance</p>
          </Button>
        </form>
      </Form>
      {inputs ? (
        <>
          <Separator className="my-4" />
          <PerformanceResult inputs={inputs} className="mt-4" />
        </>
      ) : (
        <p className="text-center mt-8 mb-6 scroll-m-20 text-2xl font-semibold tracking-tight">
          No results yet !
        </p>
      )}
    </>
  );
}

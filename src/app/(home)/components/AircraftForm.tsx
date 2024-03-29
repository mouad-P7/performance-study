"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, FilterX } from "lucide-react";
import { aircraftFormSchema } from "@/schema/aircraft.schema";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SteadyPerformance from "./SteadyPerformance";
import NonSteadyPerformance from "./NonSteadyPerformance";
import { Separator } from "@/components/ui/separator";
import { aircraftFormFields } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function AircraftForm() {
  const [inputs, setInputs] = useState<
    z.infer<typeof aircraftFormSchema> | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // 1. Define your form.
  const defaultFieldValues = aircraftFormFields.reduce((acc: any, field) => {
    acc[field.name] = "";
    return acc;
  }, {});
  const form = useForm<z.infer<typeof aircraftFormSchema>>({
    resolver: zodResolver(aircraftFormSchema),
    defaultValues: defaultFieldValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof aircraftFormSchema>) {
    try {
      setIsSubmitting(true);
      setInputs(values);
      toast({
        title: "Performance Study Is Generated Successfully.",
        // description: <pre>{JSON.stringify(values, null, 2)}</pre>,
      });
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
          className="flex flex-col gap-2"
        >
          <div className="flex justify-end gap-4">
            {/* Select Aircraft */}
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={isSubmitting}
              onClick={() => {
                form.reset(defaultFieldValues);
                setInputs(undefined);
              }}
            >
              <FilterX size={20} />
              <p className="ml-2">Reset Form</p>
            </Button>
          </div>
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
                        className="w-[230px]"
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
          <Button
            type="submit"
            className="my-2 mx-auto"
            disabled={isSubmitting}
          >
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
          <Separator className="my-6 h-[4px] bg-primary" />
          <Tabs defaultValue="steady-performance" className="flex flex-col">
            <TabsList className="mb-4 w-full max-w-2xl mx-auto max-sm:px-1">
              <TabsTrigger
                value="steady-performance"
                className="flex-1 max-sm:px-1"
              >
                Steady Performance
              </TabsTrigger>
              <TabsTrigger
                value="non-steady-performance"
                className="flex-1 max-sm:px-1"
              >
                Non Steady Performance
              </TabsTrigger>
            </TabsList>
            <TabsContent value="steady-performance">
              <SteadyPerformance inputs={inputs} />
            </TabsContent>
            <TabsContent value="non-steady-performance">
              <NonSteadyPerformance inputs={inputs} />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <p className="text-center my-6 scroll-m-20 text-xl font-semibold">
          Submit the form to see results !
        </p>
      )}
    </>
  );
}

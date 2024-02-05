import * as z from "zod";
import { cn } from "@/lib/utils";
import { aircraftFormSchema } from "@/schema/aircraft.schema";

export default function NonSteadyPerformance({
  inputs,
  className,
}: {
  inputs: z.infer<typeof aircraftFormSchema>;
  className?: string;
}) {
  const {
    wingSpan,
    wingArea,
    spanEfficiencyFactor,
    liftCoefficient1,
    liftCoefficient2,
    alpha1,
    alpha2,
    alpha0,
    thrustAvailable,
    m,
    maxTakeOffWeight,
    maxLiftCoefficient,
    sweepAngle,
    thrustSpecificFuelConsumption,
    maxUsableFuelWeight,
  }: any = inputs;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="h-[350px]">
        <h1 className="text-center text-xl font-semibold">Comming Soon</h1>
      </div>
    </div>
  );
}

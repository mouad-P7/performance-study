import * as z from "zod";

const zodNumberType = z.coerce
  .number({
    required_error: "Input is required",
    invalid_type_error: "Input must be a number",
  })
  .positive({ message: "Input must be a positive number" });

export const aircraftFormSchema = z.object({
  // selectedAircraft: z.string().nullable(),
  wingSpan: zodNumberType,
  wingArea: zodNumberType,
  spanEfficiencyFactor: zodNumberType,
  liftCoefficient1: zodNumberType,
  liftCoefficient2: zodNumberType,
  alpha1: zodNumberType,
  alpha2: zodNumberType,
  alpha0: zodNumberType,
  thrustAvailable: zodNumberType,
  m: zodNumberType,
  maxTakeOffWeight: zodNumberType,
  maxLiftCoefficient: zodNumberType,
  sweepAngle: zodNumberType,
  thrustSpecificFuelConsumption: zodNumberType,
  maxUsableFuelWeight: zodNumberType,
});

import * as z from "zod";

function parseNumber(value: string) {
  return parseFloat(value);
}

export const aircraftFormSchema = z.object({
  // selectedAircraft: z.string().nullable(),
  wingSpan: z.string().refine(parseNumber, {
    message: "Invalid number",
  }),
  wingArea: z.string().refine(parseNumber, {
    message: "Invalid number",
  }),
  spanEfficiencyFactor: z.string().refine(parseNumber, {
    message: "Invalid number",
  }),
  liftCoefficient1: z.string().refine(parseNumber, {
    message: "Invalid number",
  }),
  liftCoefficient2: z.string().refine(parseNumber, {
    message: "Invalid number",
  }),
  alpha1: z.string().refine(parseNumber, {
    message: "Invalid number",
  }),
  alpha2: z.string().refine(parseNumber, {
    message: "Invalid number",
  }),
  alpha0: z.string().refine(parseNumber, {
    message: "Invalid number",
  }),
  thrustAvailable: z.string().refine(parseNumber, {
    message: "Invalid number",
  }),
  maxTakeOffWeight: z.string().refine(parseNumber, {
    message: "Invalid number",
  }),
  maxLiftCoefficient: z.string().refine(parseNumber, {
    message: "Invalid number",
  }),
  sweepAngle: z.string().refine(parseNumber, {
    message: "Invalid number",
  }),
});

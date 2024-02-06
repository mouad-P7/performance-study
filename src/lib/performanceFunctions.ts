import { data, h_gho } from "@/lib/constants";

export type zodNumber = string | number;

export function getLiftCoefficient(
  liftCoefficient1: zodNumber,
  liftCoefficient2: zodNumber,
  alpha1: zodNumber,
  alpha2: zodNumber,
  alpha0: zodNumber,
  aspectRatio: number,
  spanEfficiencyFactor: zodNumber
): number {
  const LC_1 =
    typeof liftCoefficient1 === "string"
      ? parseFloat(liftCoefficient1)
      : liftCoefficient1;
  const LC_2 =
    typeof liftCoefficient2 === "string"
      ? parseFloat(liftCoefficient2)
      : liftCoefficient2;
  const alpha_1 = typeof alpha1 === "string" ? parseFloat(alpha1) : alpha1;
  const alpha_2 = typeof alpha2 === "string" ? parseFloat(alpha2) : alpha2;
  const alpha_0 = typeof alpha0 === "string" ? parseFloat(alpha0) : alpha0;
  const e =
    typeof spanEfficiencyFactor === "string"
      ? parseFloat(spanEfficiencyFactor)
      : spanEfficiencyFactor;
  if (
    isNaN(LC_1) ||
    isNaN(LC_2) ||
    isNaN(alpha_1) ||
    isNaN(alpha_2) ||
    isNaN(alpha_0) ||
    isNaN(e)
  ) {
    throw new Error("Invalid getLiftCoefficient input.");
  }

  const a0 = ((LC_1 - LC_2) / (alpha_1 - alpha_2)) * (180 / data.PI);
  const A = (a0 * data.PI) / (180 * (1 + a0 / (data.PI * e * aspectRatio)));
  return A * (alpha_2 - alpha_0);
}

export function getThrustRequiredArray(
  wingArea: zodNumber,
  maxTakeOffWeight: zodNumber
): number[] {
  const area = typeof wingArea === "string" ? parseFloat(wingArea) : wingArea;
  const W =
    typeof maxTakeOffWeight === "string"
      ? parseFloat(maxTakeOffWeight)
      : maxTakeOffWeight;
  if (isNaN(area) || isNaN(W)) {
    throw new Error("Invalid getThrustRequiredArray input.");
  }

  let thrustRequiredArray: number[] = [];
  for (let i = 0; i < data.velocityArray.length; i++) {
    const V = data.velocityArray[i];
    const CL = (2 * W) / (data.gho * V ** 2 * area);
    const CD = data.CD0 + data.k * CL ** 2;
    const thrust = 0.5 * data.gho * V ** 2 * area * CD;
    thrustRequiredArray.push(thrust);
  }
  return thrustRequiredArray;
}

export function get_TA_At1000ft(
  thrustAvailable: zodNumber,
  m: zodNumber
): number {
  const TA =
    typeof thrustAvailable === "string"
      ? parseFloat(thrustAvailable)
      : thrustAvailable;
  const M = typeof m === "string" ? parseFloat(m) : m;
  if (isNaN(TA) || isNaN(M)) {
    throw new Error("Invalid get_TA_At1000ft input.");
  }

  return (TA * data.ghoAt1000ft * M) / data.gho;
}

export function get_PR_PA_Arrays(
  thrustAvailable: zodNumber,
  thrustRequiredArray: number[]
) {
  const TA =
    typeof thrustAvailable === "string"
      ? parseFloat(thrustAvailable)
      : thrustAvailable;
  if (isNaN(TA)) {
    throw new Error("Invalid get_PR_PA_Arrays input.");
  }

  const powerRequiredArray: number[] = [];
  const powerAvailableArray: number[] = [];
  for (let i = 0; i < data.velocityArray.length; i++) {
    const V = data.velocityArray[i];
    powerAvailableArray.push(TA * V);
    powerRequiredArray.push(thrustRequiredArray[i] * V);
  }
  return { powerRequiredArray, powerAvailableArray };
}

export function getMaxVelocity(TdivW: number, WdivS: number): number {
  return Math.sqrt(
    (TdivW * WdivS + WdivS * Math.sqrt(TdivW ** 2 - 4 * data.CD0 * data.k)) /
      (data.gho * data.CD0)
  );
}

export function get_CLdivCD_Ratios() {
  const CLdivCD_max = Math.sqrt(1 / (4 * data.CD0 * data.k));
  const CL_1sur2_divCD_max =
    (3 / 4) * (1 / (2 * data.CD0 ** 3 * data.k)) ** (1 / 4);
  const CL_3sur2_divCD_max =
    (1 / 4) * (3 / (data.CD0 ** (1 / 3) * data.k)) ** (3 / 4);
  return { CLdivCD_max, CL_1sur2_divCD_max, CL_3sur2_divCD_max };
}

export function get_CLdivCD_Velocities(WdivS: number) {
  const velocity_1 = Math.sqrt(
    (2 / data.gho) * Math.sqrt(data.k / data.CD0) * WdivS
  );
  const velocity_1sur2 = Math.sqrt(
    (2 / data.gho) * Math.sqrt((3 * data.k) / data.CD0) * WdivS
  );
  const velocity_3sur2 = Math.sqrt(
    (2 / data.gho) * Math.sqrt(data.k / (3 * data.CD0)) * WdivS
  );
  return { velocity_1, velocity_1sur2, velocity_3sur2 };
}

export function getStallVelocity(
  maxLiftCoefficient: zodNumber,
  sweepAngle: zodNumber,
  maxTakeOffWeight: zodNumber,
  wingArea: zodNumber
): number {
  const area = typeof wingArea === "string" ? parseFloat(wingArea) : wingArea;
  const maxLC =
    typeof maxLiftCoefficient === "string"
      ? parseFloat(maxLiftCoefficient)
      : maxLiftCoefficient;
  const gama =
    typeof sweepAngle === "string" ? parseFloat(sweepAngle) : sweepAngle;
  const W =
    typeof maxTakeOffWeight === "string"
      ? parseFloat(maxTakeOffWeight)
      : maxTakeOffWeight;
  if (isNaN(area) || isNaN(maxLC) || isNaN(gama) || isNaN(W)) {
    throw new Error("Invalid getStallVelocity input.");
  }

  const CLmax = maxLC * Math.cos(gama * (data.PI / 180));
  return Math.sqrt((2 * W) / (data.gho * area * CLmax));
}

export function getRateOfClimbArray(
  powerRequiredArray: number[],
  powerAvailableArray: number[],
  maxTakeOffWeight: zodNumber
): number[] {
  const W =
    typeof maxTakeOffWeight === "string"
      ? parseFloat(maxTakeOffWeight)
      : maxTakeOffWeight;
  if (isNaN(W)) {
    throw new Error("Invalid getRateOfClimbArray input.");
  }

  const rateOfClimbArray = [];
  for (let i = 0; i < powerRequiredArray.length; i++) {
    rateOfClimbArray.push((powerAvailableArray[i] - powerRequiredArray[i]) / W);
  }
  return rateOfClimbArray;
}

export function getZ(CLdivCD_max: number, TdivW: number): number {
  return 1 + Math.sqrt(1 + 3 / (CLdivCD_max ** 2 * TdivW ** 2));
}

export function getMaxRateOfClimb(
  Z: number,
  CLdivCD_max: number,
  TdivW: number,
  WdivS: number
): number {
  return (
    Math.sqrt((WdivS * Z) / (3 * data.gho * data.CD0)) *
    TdivW ** (3 / 2) *
    (1 - Z / 6 - 3 / (2 * TdivW ** 2 * CLdivCD_max ** 2 * Z))
  );
}

export function getMaxRateOfClimbVelocity(
  CLdivCD_max: number,
  TdivW: number,
  WdivS: number
): number {
  return Math.sqrt(
    ((TdivW * WdivS) / (3 * data.gho * data.CD0)) *
      (1 + Math.sqrt(1 + 3 / (CLdivCD_max ** 2 * TdivW ** 2)))
  );
}

export function getMaxClimbAngleVelocity(
  WdivS: number,
  maxClimbAngleInRadian: number
): number {
  return Math.sqrt(
    (2 / data.gho) *
      Math.sqrt(data.k / data.CD0) *
      WdivS *
      Math.cos(maxClimbAngleInRadian)
  );
}

export function getMinSinkVelocity(
  CL_3sur2_divCD_max: number,
  WdivS: number
): number {
  return Math.sqrt((2 / (data.gho * CL_3sur2_divCD_max)) * WdivS);
}

export function getRateOfClimbAtAltitudesArray(
  thrustAvailable: zodNumber,
  maxTakeOffWeight: zodNumber,
  m: zodNumber,
  WdivS: number,
  CLdivCD_max: number,
  Z: number
): { h: number; maxRateOfClimb: number }[] {
  const TA =
    typeof thrustAvailable === "string"
      ? parseFloat(thrustAvailable)
      : thrustAvailable;
  const W =
    typeof maxTakeOffWeight === "string"
      ? parseFloat(maxTakeOffWeight)
      : maxTakeOffWeight;
  const M = typeof m === "string" ? parseFloat(m) : m;
  if (isNaN(TA) || isNaN(W) || isNaN(M)) {
    throw new Error("Invalid getRateOfClimbAtAltitudesArray input.");
  }

  const rateOfClimbAtAltitudesArray = [];
  for (let i = h_gho.length - 1; i >= 0; i--) {
    const TdivW = (TA / W) * (h_gho[i].gho / data.gho) ** M;
    rateOfClimbAtAltitudesArray.push({
      h: h_gho[i].h,
      maxRateOfClimb:
        Math.sqrt((WdivS * Z) / (3 * h_gho[i].gho * data.CD0)) *
        TdivW ** (3 / 2) *
        (1 - Z / 6 - 3 / (2 * TdivW ** 2 * CLdivCD_max ** 2 * Z)),
    });
  }
  return rateOfClimbAtAltitudesArray;
}

export function getTimeOfClimbing() {
  const altitudeToClimb = 10000; // ft
  const rateOfClimbAtSeaLevel = 163.098; // ???
  const slope = -0.0035398; // ???
  const timeOfClimbingInSeconds =
    (Math.log(rateOfClimbAtSeaLevel + slope * altitudeToClimb) -
      Math.log(rateOfClimbAtSeaLevel)) /
    slope;
  const timeOfClimbingInMinutes = timeOfClimbingInSeconds / 60;
  return { seconds: timeOfClimbingInSeconds, minutes: timeOfClimbingInMinutes };
}

export function getMaxRange(
  maxTakeOffWeight: zodNumber,
  maxUsableFuelWeight: zodNumber,
  thrustSpecificFuelConsumption: zodNumber,
  wingArea: zodNumber,
  CL_1sur2_divCD_max: number
): number {
  const W =
    typeof maxTakeOffWeight === "string"
      ? parseFloat(maxTakeOffWeight)
      : maxTakeOffWeight;
  const maxUsableFuelW =
    typeof maxUsableFuelWeight === "string"
      ? parseFloat(maxUsableFuelWeight)
      : maxUsableFuelWeight;
  const Ct =
    typeof thrustSpecificFuelConsumption === "string"
      ? parseFloat(thrustSpecificFuelConsumption)
      : thrustSpecificFuelConsumption;
  const area = typeof wingArea === "string" ? parseFloat(wingArea) : wingArea;
  if (isNaN(W) || isNaN(maxUsableFuelW) || isNaN(Ct) || isNaN(area)) {
    throw new Error("Invalid getMaxRange input.");
  }

  return (
    ((2 * 3600) / Ct) *
    Math.sqrt((2 / data.gho) * area) *
    CL_1sur2_divCD_max *
    (Math.sqrt(W) - Math.sqrt(W - maxUsableFuelW))
  );
}

export function getMaxEndurance(
  maxTakeOffWeight: zodNumber,
  maxUsableFuelWeight: zodNumber,
  thrustSpecificFuelConsumption: zodNumber,
  CLdivCD_max: number
) {
  const W =
    typeof maxTakeOffWeight === "string"
      ? parseFloat(maxTakeOffWeight)
      : maxTakeOffWeight;
  const maxUsableFuelW =
    typeof maxUsableFuelWeight === "string"
      ? parseFloat(maxUsableFuelWeight)
      : maxUsableFuelWeight;
  const Ct =
    typeof thrustSpecificFuelConsumption === "string"
      ? parseFloat(thrustSpecificFuelConsumption)
      : thrustSpecificFuelConsumption;
  if (isNaN(W) || isNaN(maxUsableFuelW) || isNaN(Ct)) {
    throw new Error("Invalid getMaxEndurance input.");
  }

  const maxEnduranceInSecondes =
    (3600 / Ct) * CLdivCD_max * Math.log(W / (W - maxUsableFuelW));
  const maxEnduranceInHoures = maxEnduranceInSecondes / 3600;
  return { secondes: maxEnduranceInSecondes, houres: maxEnduranceInHoures };
}

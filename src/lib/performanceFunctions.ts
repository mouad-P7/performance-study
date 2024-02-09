import { data, h_gho } from "@/lib/constants";

export function getLiftCoefficient(
  liftCoefficient1: number,
  liftCoefficient2: number,
  alpha1: number,
  alpha2: number,
  alpha0: number,
  aspectRatio: number,
  spanEfficiencyFactor: number
) {
  const a0 =
    ((liftCoefficient1 - liftCoefficient2) / (alpha1 - alpha2)) *
    (180 / Math.PI);
  const A =
    (a0 * Math.PI) /
    (180 * (1 + a0 / (Math.PI * spanEfficiencyFactor * aspectRatio)));
  return A * (alpha2 - alpha0);
}

export function getThrustRequiredArray(
  wingArea: number,
  maxTakeOffWeight: number
) {
  let thrustRequiredArray: number[] = [];
  for (let i = 0; i < data.velocityArray.length; i++) {
    const V = data.velocityArray[i];
    const CL = (2 * maxTakeOffWeight) / (data.gho * V ** 2 * wingArea);
    const CD = data.CD0 + data.k * CL ** 2;
    const thrust = 0.5 * data.gho * V ** 2 * wingArea * CD;
    thrustRequiredArray.push(thrust);
  }
  return thrustRequiredArray;
}

export function get_TA_At1000ft(thrustAvailable: number, m: number) {
  return (thrustAvailable * data.ghoAt1000ft * m) / data.gho;
}

export function get_PR_PA_Arrays(
  thrustAvailable: number,
  thrustRequiredArray: number[]
) {
  const powerRequiredArray: number[] = [];
  const powerAvailableArray: number[] = [];
  for (let i = 0; i < data.velocityArray.length; i++) {
    const V = data.velocityArray[i];
    powerAvailableArray.push(thrustAvailable * V);
    powerRequiredArray.push(thrustRequiredArray[i] * V);
  }
  return { powerRequiredArray, powerAvailableArray };
}

export function getMaxVelocity(TdivW: number, WdivS: number) {
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
  maxLiftCoefficient: number,
  sweepAngle: number,
  maxTakeOffWeight: number,
  wingArea: number
) {
  const CLmax = maxLiftCoefficient * Math.cos(sweepAngle * (Math.PI / 180));
  return Math.sqrt((2 * maxTakeOffWeight) / (data.gho * wingArea * CLmax));
}

export function getRateOfClimbArray(
  powerRequiredArray: number[],
  powerAvailableArray: number[],
  maxTakeOffWeight: number
) {
  const rateOfClimbArray: number[] = [];
  for (let i = 0; i < powerRequiredArray.length; i++) {
    rateOfClimbArray.push(
      (powerAvailableArray[i] - powerRequiredArray[i]) / maxTakeOffWeight
    );
  }
  return rateOfClimbArray;
}

export function getZ(CLdivCD_max: number, TdivW: number) {
  return 1 + Math.sqrt(1 + 3 / (CLdivCD_max ** 2 * TdivW ** 2));
}

export function getMaxRateOfClimb(
  Z: number,
  CLdivCD_max: number,
  TdivW: number,
  WdivS: number
) {
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
) {
  return Math.sqrt(
    ((TdivW * WdivS) / (3 * data.gho * data.CD0)) *
      (1 + Math.sqrt(1 + 3 / (CLdivCD_max ** 2 * TdivW ** 2)))
  );
}

export function getMaxClimbAngleVelocity(
  WdivS: number,
  maxClimbAngleInRadian: number
) {
  return Math.sqrt(
    (2 / data.gho) *
      Math.sqrt(data.k / data.CD0) *
      WdivS *
      Math.cos(maxClimbAngleInRadian)
  );
}

export function getMinSinkVelocity(CL_3sur2_divCD_max: number, WdivS: number) {
  return Math.sqrt((2 / (data.gho * CL_3sur2_divCD_max)) * WdivS);
}

export function getRateOfClimbAtAltitudesArray(
  thrustAvailable: number,
  maxTakeOffWeight: number,
  m: number,
  WdivS: number,
  CLdivCD_max: number,
  Z: number
) {
  const rateOfClimbAtAltitudesArray = [];
  for (let i = h_gho.length - 1; i >= 0; i--) {
    const TdivW =
      (thrustAvailable / maxTakeOffWeight) * (h_gho[i].gho / data.gho) ** m;
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
  maxTakeOffWeight: number,
  maxUsableFuelWeight: number,
  thrustSpecificFuelConsumption: number,
  wingArea: number,
  CL_1sur2_divCD_max: number
) {
  return (
    ((2 * 3600) / thrustSpecificFuelConsumption) *
    Math.sqrt((2 / data.gho) * wingArea) *
    CL_1sur2_divCD_max *
    (Math.sqrt(maxTakeOffWeight) -
      Math.sqrt(maxTakeOffWeight - maxUsableFuelWeight))
  );
}

export function getMaxEndurance(
  maxTakeOffWeight: number,
  maxUsableFuelWeight: number,
  thrustSpecificFuelConsumption: number,
  CLdivCD_max: number
) {
  const maxEnduranceInSecondes =
    (3600 / thrustSpecificFuelConsumption) *
    CLdivCD_max *
    Math.log(maxTakeOffWeight / (maxTakeOffWeight - maxUsableFuelWeight));
  const maxEnduranceInHoures = maxEnduranceInSecondes / 3600;
  return { secondes: maxEnduranceInSecondes, houres: maxEnduranceInHoures };
}

import * as z from "zod";
import { cn } from "@/lib/utils";
import { aircraftFormSchema } from "@/schema/aircraft.schema";
import { data, h_gho } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import TR_TA_Graphe from "./TR_TA_Graphe";
import PR_PA_Graphe from "./PR_PA_Graphe";
import RateOfClimbGraphe from "./RateOfClimbGraphe";
import SinkVelocityGraphe from "./SinkVelocityGraphe";
import RateOfClimbAtAltitudesGraphe from "./RateOfClimbAtAltitudesGraphe";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SteadyPerformance({
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

  // Aspect Ratio
  const aspectRatio = wingSpan ** 2 / wingArea;

  // Lift Coefficient
  const a0 =
    ((liftCoefficient1 - liftCoefficient2) / (alpha1 - alpha2)) *
    (180 / data.PI);
  const A =
    (a0 * data.PI) /
    (180 * (1 + a0 / (data.PI * spanEfficiencyFactor * aspectRatio)));
  const liftCoefficient = A * (alpha2 - alpha0);

  // Thrust Required | Thrust Available
  let thrustRequiredArray: number[] = [];
  for (let i = 0; i < data.velocityArray.length; i++) {
    const V = data.velocityArray[i];
    const CL = (2 * maxTakeOffWeight) / (data.gho * V ** 2 * wingArea);
    const CD = data.CD0 + data.k * CL ** 2;
    const thrust = 0.5 * data.gho * V ** 2 * wingArea * CD;
    thrustRequiredArray.push(thrust);
  }
  const thrustAvailableAt1000ft =
    (thrustAvailable * data.ghoAt1000ft * m) / data.gho;

  // Power Required | Power Available
  let powerRequiredArray: number[] = [];
  let powerAvailableArray: number[] = [];
  for (let i = 0; i < data.velocityArray.length; i++) {
    const V = data.velocityArray[i];
    powerAvailableArray.push(thrustAvailable * V);
    powerRequiredArray.push(thrustRequiredArray[i] * V);
  }

  // Maximum Velocity Analytically
  const TdivW = thrustAvailable / maxTakeOffWeight;
  const WdivS = maxTakeOffWeight / wingArea;
  const maxVelocity = Math.sqrt(
    (TdivW * WdivS + WdivS * Math.sqrt(TdivW ** 2 - 4 * data.CD0 * data.k)) /
      (data.gho * data.CD0)
  );

  // Lift To Drag Ratios
  const CLdivCD_max = Math.sqrt(1 / (4 * data.CD0 * data.k));
  const velocity_1 = Math.sqrt(
    (2 / data.gho) * Math.sqrt(data.k / data.CD0) * WdivS
  );
  const CL_1sur2_divCD_max =
    (3 / 4) * (1 / (2 * data.CD0 ** 3 * data.k)) ** (1 / 4);
  const velocity_1sur2 = Math.sqrt(
    (2 / data.gho) * Math.sqrt((3 * data.k) / data.CD0) * WdivS
  );
  const CL_3sur2_divCD_max =
    (1 / 4) * (3 / (data.CD0 ** (1 / 3) * data.k)) ** (3 / 4);
  const velocity_3sur2 = Math.sqrt(
    (2 / data.gho) * Math.sqrt(data.k / (3 * data.CD0)) * WdivS
  );

  // Stall Velocity
  const CLmax = maxLiftCoefficient * Math.cos(sweepAngle * (data.PI / 180));
  const stallVelocity = Math.sqrt(
    (2 * maxTakeOffWeight) / (data.gho * wingArea * CLmax)
  );

  // Maximum Rate Of Climb Array
  let RateOfClimbArray = [];
  for (let i = 0; i < powerRequiredArray.length; i++) {
    RateOfClimbArray.push(
      (powerAvailableArray[i] - powerRequiredArray[i]) / maxTakeOffWeight
    );
  }

  // Maximum Rate Of Climb
  const Z = 1 + Math.sqrt(1 + 3 / (CLdivCD_max ** 2 * TdivW ** 2));
  const maxRateOfClimb =
    Math.sqrt((WdivS * Z) / (3 * data.gho * data.CD0)) *
    TdivW ** (3 / 2) *
    (1 - Z / 6 - 3 / (2 * TdivW ** 2 * CLdivCD_max ** 2 * Z));
  const maxRateOfClimbVelocity = Math.sqrt(
    ((TdivW * WdivS) / (3 * data.gho * data.CD0)) *
      (1 + Math.sqrt(1 + 3 / (CLdivCD_max ** 2 * TdivW ** 2)))
  );

  // Maximum Climb Angle
  const maxClimbAngleInRadian = Math.asin(1 / CLdivCD_max);
  const maxClimbAngleInDegrees = maxClimbAngleInRadian * (180 / data.PI);
  const maxClimbAngleVelocity = Math.sqrt(
    (2 / data.gho) *
      Math.sqrt(data.k / data.CD0) *
      WdivS *
      Math.cos(maxClimbAngleInRadian)
  );
  const maxClimbAngleRateOfClimb =
    maxClimbAngleVelocity * Math.sin(maxClimbAngleInRadian);

  // ???
  // const angle1 = ;
  // const angle2 = ;

  // Minimum Sink Velocity
  const minSinkVelocity = Math.sqrt(
    (2 / (data.gho * CL_3sur2_divCD_max)) * WdivS
  );

  // Minimum Glide Angle
  const minGlideAngleInRadian = Math.atan(1 / CLdivCD_max);
  const minGlideAngleInDegree = minGlideAngleInRadian * (180 / data.PI);

  // Maximum Rate Of Climb At different altitudes
  let RateOfClimbAtAltitudesArray = [];
  for (let i = h_gho.length - 1; i >= 0; i--) {
    const TdivW =
      (thrustAvailable / maxTakeOffWeight) * (h_gho[i].gho / data.gho) ** m;
    RateOfClimbAtAltitudesArray.push({
      h: h_gho[i].h,
      maxRateOfClimb:
        Math.sqrt((WdivS * Z) / (3 * h_gho[i].gho * data.CD0)) *
        TdivW ** (3 / 2) *
        (1 - Z / 6 - 3 / (2 * TdivW ** 2 * CLdivCD_max ** 2 * Z)),
    });
  }
  const serviceCeiling = 0; // ???
  const absoluteCeiling = 0; // ???

  // Time Of Climbing
  const altitudeToClimb = 10000; // ft
  const rateOfClimbAtSeaLevel = 163.098; // ???
  const slope = -0.0035398; // ???
  const timeOfClimbingInSeconds =
    (Math.log(rateOfClimbAtSeaLevel + slope * altitudeToClimb) -
      Math.log(rateOfClimbAtSeaLevel)) /
    slope;
  const timeOfClimbingInMinutes = timeOfClimbingInSeconds / 60;

  // Maximum Range
  const maxZeroFuelWeight = maxTakeOffWeight - maxUsableFuelWeight;
  const maxRange =
    ((2 * 3600) / thrustSpecificFuelConsumption) *
    Math.sqrt((2 / data.gho) * wingArea) *
    CL_1sur2_divCD_max *
    (Math.sqrt(maxTakeOffWeight) - Math.sqrt(maxZeroFuelWeight));
  const maxRangeVelocity = velocity_1sur2;

  // Maximum Endurance
  const maxEnduranceInSecondes =
    (3600 / thrustSpecificFuelConsumption) *
    CLdivCD_max *
    Math.log(maxTakeOffWeight / maxZeroFuelWeight);
  const maxEnduranceInHoures = maxEnduranceInSecondes / 3600;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <p>
        Aspect Ratio (AR) ={" "}
        <span className="font-medium">{aspectRatio.toFixed(2)}</span>
      </p>
      <p>
        Lift Coefficient (CL) ={" "}
        <span className="font-medium">{liftCoefficient.toFixed(4)}</span>
      </p>

      <Separator className="my-4" />
      <p>Thrust Required Curve:</p>
      <div className="h-[250px] sm:h-[400px]">
        <TR_TA_Graphe
          thrustRequiredArray={thrustRequiredArray}
          thrustAvailable={thrustAvailable}
          thrustAvailableAt1000ft={thrustAvailableAt1000ft}
        />
      </div>
      <p>Power Required curve:</p>
      <div className="h-[250px] sm:h-[400px]">
        <PR_PA_Graphe
          powerRequiredArray={powerRequiredArray}
          powerAvailableArray={powerAvailableArray}
        />
      </div>
      <p>
        Analytically: Maximum velocity at sea level (Vmax) ={" "}
        <span className="font-medium">{maxVelocity.toFixed(2)} ft/s</span>
      </p>

      <Separator className="my-4" />
      <p>
        (CL / CD)max ={" "}
        <span className="font-medium">{CLdivCD_max.toFixed(3)}</span> and
        it&apos;s velocity at sea level ={" "}
        <span className="font-medium">{velocity_1.toFixed(2)} ft/s</span>
      </p>
      <p>
        (CL^1/2 / CD)max ={" "}
        <span className="font-medium">{CL_1sur2_divCD_max.toFixed(3)}</span> and
        it&apos;s velocity at sea level ={" "}
        <span className="font-medium">{velocity_1sur2.toFixed(2)} ft/s</span>
      </p>
      <p>
        (CL^3/2 / CD)max ={" "}
        <span className="font-medium">{CL_3sur2_divCD_max.toFixed(3)}</span> and
        it&apos;s velocity at sea level ={" "}
        <span className="font-medium">{velocity_3sur2.toFixed(2)} ft/s</span>
      </p>

      <Separator className="my-4" />
      <p>
        Stall Velocity (Vstall) ={" "}
        <span className="font-medium">{stallVelocity.toFixed(2)} ft/s</span>
      </p>

      <Separator className="my-4" />
      <p>Rate of Climb curve:</p>
      <div className="h-[250px] sm:h-[400px]">
        <RateOfClimbGraphe RateOfClimbArray={RateOfClimbArray} />
      </div>

      <Separator className="my-4" />
      <p>
        Analytically: Maximum Rate of Climb (R/C)max ={" "}
        <span className="font-medium">{maxRateOfClimb.toFixed(2)} ft/s</span>{" "}
        and it&apos;s velocity ={" "}
        <span className="font-medium">
          {maxRateOfClimbVelocity.toFixed(2)} ft/s
        </span>
      </p>

      <Separator className="my-4" />
      <p>
        Maximum climb angle: (ϴmax) ={" "}
        <span className="font-medium">
          {maxClimbAngleInDegrees.toFixed(2)}°
        </span>{" "}
        and it&apos;s velocity ={" "}
        <span className="font-medium">
          {maxClimbAngleVelocity.toFixed(2)} ft/s
        </span>{" "}
        and it&apos;s rate of climb ={" "}
        <span className="font-medium">
          {maxClimbAngleRateOfClimb.toFixed(2)} ft/s
        </span>
      </p>

      {/* <Separator className="my-4" />
      <div className="h-[250px] sm:h-[400px]">
        <HodographGraph /> 
      </div> */}

      <Separator className="my-4" />
      <p>Sink Velocity curve:</p>
      <div className="h-[250px] sm:h-[400px]">
        <SinkVelocityGraphe
          powerRequiredArray={powerRequiredArray}
          maxTakeOffWeight={maxTakeOffWeight}
        />
      </div>
      <p>
        Analytically: Minimum Sink Velocity at sea level (Vvmin) ={" "}
        <span className="font-medium">{minSinkVelocity.toFixed(2)} ft/s</span>
      </p>
      <p>
        Minimum Equilibrium Glide Angle (ϴmin) ={" "}
        <span className="font-medium">{minGlideAngleInDegree.toFixed(2)}°</span>
      </p>

      <Separator className="my-4" />
      <p>Maximum Rate Of Climb curve at different altitudes:</p>
      <div className="h-[250px] sm:h-[400px]">
        <RateOfClimbAtAltitudesGraphe
          RateOfClimbAtAltitudesArray={RateOfClimbAtAltitudesArray}
        />
      </div>
      <p>
        Service Ceiling ={" "}
        <span className="font-medium">{serviceCeiling.toFixed(2)} ft</span> and
        Absolute Ceiling ={" "}
        <span className="font-medium">{absoluteCeiling.toFixed(2)} ft</span>
      </p>

      <Separator className="my-4" />
      <p>
        Time Of Climbing ={" "}
        <span className="font-medium">
          {timeOfClimbingInSeconds.toFixed(2)} s
        </span>{" "}
        ={" "}
        <span className="font-medium">
          {timeOfClimbingInMinutes.toFixed(2)} min
        </span>
      </p>

      <Separator className="my-4" />
      <Alert variant="destructive">
        <AlertTitle>Warning:</AlertTitle>
        <AlertDescription>
          The true Maximum Range = (Rmax) * Number of engines
        </AlertDescription>
      </Alert>
      <p>
        Maximum Range (Rmax) ={" "}
        <span className="font-medium">{maxRange.toLocaleString()} ft</span> and
        it&apos;s velocity ={" "}
        <span className="font-medium">{maxRangeVelocity.toFixed(2)} ft/s</span>
      </p>

      <Separator className="my-4" />
      <p>
        Max Endurance ={" "}
        <span className="font-medium">
          {maxEnduranceInSecondes.toFixed(2)} s
        </span>{" "}
        ={" "}
        <span className="font-medium">
          {maxEnduranceInHoures.toFixed(2)} hours{" "}
        </span>{" "}
        and it&apos;s velocity ={" "}
        <span className="font-medium">{velocity_1.toFixed(2)} ft/s</span>
      </p>
    </div>
  );
}

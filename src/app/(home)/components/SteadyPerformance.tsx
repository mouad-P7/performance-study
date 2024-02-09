import * as z from "zod";
import { cn } from "@/lib/utils";
import { aircraftFormSchema } from "@/schema/aircraft.schema";
import { Separator } from "@/components/ui/separator";
import TR_TA_Graphe from "./TR_TA_Graphe";
import PR_PA_Graphe from "./PR_PA_Graphe";
import RateOfClimbGraphe from "./RateOfClimbGraphe";
import SinkVelocityGraphe from "./SinkVelocityGraphe";
import RateOfClimbAtAltitudesGraphe from "./RateOfClimbAtAltitudesGraphe";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  getLiftCoefficient,
  getThrustRequiredArray,
  get_TA_At1000ft,
  get_PR_PA_Arrays,
  getMaxVelocity,
  get_CLdivCD_Ratios,
  get_CLdivCD_Velocities,
  getStallVelocity,
  getRateOfClimbArray,
  getZ,
  getMaxRateOfClimb,
  getMaxRateOfClimbVelocity,
  getMaxClimbAngleVelocity,
  getMinSinkVelocity,
  getRateOfClimbAtAltitudesArray,
  getTimeOfClimbing,
  getMaxRange,
  getMaxEndurance,
} from "@/lib/performanceFunctions";

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
  } = inputs;

  const aspectRatio = wingSpan ** 2 / wingArea;

  const liftCoefficient = getLiftCoefficient(
    liftCoefficient1,
    liftCoefficient2,
    alpha1,
    alpha2,
    alpha0,
    aspectRatio,
    spanEfficiencyFactor
  );

  const thrustRequiredArray = getThrustRequiredArray(
    wingArea,
    maxTakeOffWeight
  );

  const thrustAvailableAt1000ft = get_TA_At1000ft(thrustAvailable, m);

  const { powerRequiredArray, powerAvailableArray } = get_PR_PA_Arrays(
    thrustAvailable,
    thrustRequiredArray
  );

  const TdivW = thrustAvailable / maxTakeOffWeight;
  const WdivS = maxTakeOffWeight / wingArea;
  const maxVelocity = getMaxVelocity(TdivW, WdivS);

  const { CLdivCD_max, CL_1sur2_divCD_max, CL_3sur2_divCD_max } =
    get_CLdivCD_Ratios();
  const { velocity_1, velocity_1sur2, velocity_3sur2 } =
    get_CLdivCD_Velocities(WdivS);

  const stallVelocity = getStallVelocity(
    maxLiftCoefficient,
    sweepAngle,
    maxTakeOffWeight,
    wingArea
  );

  const rateOfClimbArray = getRateOfClimbArray(
    powerRequiredArray,
    powerAvailableArray,
    maxTakeOffWeight
  );

  const Z = getZ(CLdivCD_max, TdivW);
  const maxRateOfClimb = getMaxRateOfClimb(Z, CLdivCD_max, TdivW, WdivS);
  const maxRateOfClimbVelocity = getMaxRateOfClimbVelocity(
    CLdivCD_max,
    TdivW,
    WdivS
  );

  const maxClimbAngleInRadian = Math.asin(1 / CLdivCD_max);
  const maxClimbAngleInDegrees = maxClimbAngleInRadian * (180 / Math.PI);
  const maxClimbAngleVelocity = getMaxClimbAngleVelocity(
    WdivS,
    maxClimbAngleInRadian
  );
  const maxClimbAngleRateOfClimb =
    maxClimbAngleVelocity * Math.sin(maxClimbAngleInRadian);

  // The hodograph diagram for climb performance at sea level
  // const angle1 = ???;
  // const angle2 = ???;

  const minSinkVelocity = getMinSinkVelocity(CL_3sur2_divCD_max, WdivS);
  const minGlideAngleInRadian = Math.atan(1 / CLdivCD_max);
  const minGlideAngleInDegree = minGlideAngleInRadian * (180 / Math.PI);

  const rateOfClimbAtAltitudesArray = getRateOfClimbAtAltitudesArray(
    thrustAvailable,
    maxTakeOffWeight,
    m,
    WdivS,
    CLdivCD_max,
    Z
  );
  const serviceCeiling = 0; // ???
  const absoluteCeiling = 0; // ???

  const timeOfClimbing = getTimeOfClimbing();

  const maxRange = getMaxRange(
    maxTakeOffWeight,
    maxUsableFuelWeight,
    thrustSpecificFuelConsumption,
    wingArea,
    CL_1sur2_divCD_max
  );
  const maxRangeVelocity = velocity_1sur2;

  const maxEndurance = getMaxEndurance(
    maxTakeOffWeight,
    maxUsableFuelWeight,
    thrustSpecificFuelConsumption,
    CLdivCD_max
  );

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
        <RateOfClimbGraphe RateOfClimbArray={rateOfClimbArray} />
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
          RateOfClimbAtAltitudesArray={rateOfClimbAtAltitudesArray}
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
          {timeOfClimbing.seconds.toFixed(2)} s
        </span>{" "}
        ={" "}
        <span className="font-medium">
          {timeOfClimbing.minutes.toFixed(2)} min
        </span>
      </p>

      <Separator className="my-4" />
      <Alert variant="destructive" className="p-2">
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
          {maxEndurance.secondes.toFixed(2)} s
        </span>{" "}
        ={" "}
        <span className="font-medium">
          {maxEndurance.houres.toFixed(2)} hours{" "}
        </span>{" "}
        and it&apos;s velocity ={" "}
        <span className="font-medium">{velocity_1.toFixed(2)} ft/s</span>
      </p>
    </div>
  );
}

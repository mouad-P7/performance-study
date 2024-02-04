import * as z from "zod";
import { cn } from "@/lib/utils";
import { aircraftFormSchema } from "@/schema/aircraft.schema";
import { data } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import TR_TA_Graphe from "./TR_TA_Graphe";
import PR_PA_Graphe from "./PR_PA_Graphe";
import RateOfClimbGraphe from "./RateOfClimbGraphe";

export default function PerformanceResult({
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
    maxTakeOffWeight,
    maxLiftCoefficient,
    sweepAngle,
  }: any = inputs;

  const aspectRatio = wingSpan ** 2 / wingArea;

  const a0 =
    ((liftCoefficient1 - liftCoefficient2) / (alpha1 - alpha2)) *
    (180 / data.PI);
  const A =
    (a0 * data.PI) /
    (180 * (1 + a0 / (data.PI * spanEfficiencyFactor * aspectRatio)));
  const liftCoefficient = A * (alpha2 - alpha0);

  let thrustRequiredArray: number[] = [];
  for (let i = 0; i < data.velocityArray.length; i++) {
    const V = data.velocityArray[i];
    const CL = (2 * maxTakeOffWeight) / (data.gho * V ** 2 * wingArea);
    const CD = data.CD0 + data.k * CL ** 2;
    const thrust = 0.5 * data.gho * V ** 2 * wingArea * CD;
    thrustRequiredArray.push(thrust);
  }

  // const thrustAvailableAt1000ft =
  //   (thrustAvailable * data.ghoAt1000ft * data.m) / data.gho;

  let powerRequiredArray: number[] = [];
  let powerAvailableArray: number[] = [];
  for (let i = 0; i < data.velocityArray.length; i++) {
    const V = data.velocityArray[i];
    powerAvailableArray.push(thrustAvailable * V);
    powerRequiredArray.push(thrustRequiredArray[i] * V);
  }

  const TR = 54063; // ???
  const TRdivW = TR / maxTakeOffWeight;
  const WdivS = maxTakeOffWeight / wingArea;
  const maxVelocity =
    ((TRdivW * WdivS * Math.sqrt(TRdivW ** 2 - 4 * data.CD0 * data.k)) /
      (data.gho * data.CD0)) **
    (1 / 2);

  const CLdivCD_max = Math.sqrt(1 / (4 * data.CD0 * data.k));
  const velocity_1 =
    (((2 * maxTakeOffWeight) / (data.gho * wingArea)) *
      Math.sqrt(data.k / data.CD0)) **
    (1 / 2);
  const CL_1sur2_divCD_max =
    (3 / 4) * (1 / (2 * data.CD0 ** 3 * data.k)) ** (1 / 4);
  const velocity_1sur2 =
    (((2 * maxTakeOffWeight) / (data.gho * wingArea)) *
      Math.sqrt((3 * data.k) / data.CD0)) **
    (1 / 2);
  const CL_3sur2_divCD_max =
    (1 / 4) * (3 / (data.CD0 ** (1 / 3) * data.k)) ** (3 / 4);
  const velocity_3sur2 =
    (((2 * maxTakeOffWeight) / (data.gho * wingArea)) *
      Math.sqrt(data.k / (3 * data.CD0))) **
    (1 / 2);

  const CLmax = maxLiftCoefficient * Math.cos(sweepAngle * (data.PI / 180));
  const stallVelocity = Math.sqrt(
    (2 * maxTakeOffWeight) / (data.gho * wingArea * CLmax)
  );

  const T = 0; // ???
  const LdivD_max = 0; // ???
  const TdivW = T / maxTakeOffWeight; // ???
  const Z = 1 + Math.sqrt(1 + 3 / (LdivD_max ** 2 * TdivW ** 2));
  const maxRateOfClimb =
    ((WdivS * Z) / (3 * data.gho * data.CD0)) ** (1 / 2) *
    TdivW ** (3 / 2) *
    (1 - Z / 6 - 3 / (2 * TdivW ** 2 * LdivD_max ** 2 * Z));
  const maxRateOfClimbVelocity =
    (((TdivW * WdivS) / (3 * data.gho * data.CD0)) *
      (1 + Math.sqrt(1 + 3 / (LdivD_max ** 2 * TdivW ** 2)))) **
    (1 / 2);

  const maxClimbAngle = Math.asin(1 / LdivD_max) * (180 / data.PI);
  const maxClimbAngleVelocity = Math.sqrt(
    ((2 * maxTakeOffWeight * Math.cos(maxClimbAngle * (data.PI / 180))) /
      (data.gho * wingArea)) *
      (data.k / data.CD0) ** (1 / 2)
  );
  const maxClimbAngleRateOfClimb =
    maxClimbAngleVelocity * Math.sin(maxClimbAngle * (data.PI / 180));

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <p>
        Aspect Ratio (AR) ={" "}
        <span className="font-medium">{aspectRatio.toFixed(3)}</span>
      </p>
      <p>
        Lift Coefficient (CL) ={" "}
        <span className="font-medium">{liftCoefficient.toFixed(4)}</span>
      </p>

      <Separator className="my-4" />
      <p>Thrust Required Curve at sea level:</p>
      <div className="h-[400px]">
        <TR_TA_Graphe
          thrustRequiredArray={thrustRequiredArray}
          thrustAvailable={thrustAvailable}
        />
      </div>

      {/* <Separator className="my-4" /> */}
      {/* <p>Thrust Required Curve at h = {h}ft:</p> */}
      {/* <TRAtAnAltitudeGraphe /> */}

      <Separator className="my-4" />
      <p>Power Required curve:</p>
      <div className="h-[400px]">
        <PR_PA_Graphe
          powerRequiredArray={powerRequiredArray}
          powerAvailableArray={powerAvailableArray}
        />
      </div>

      <Separator className="my-4" />
      <p>
        Analytically: Maximum velocity at sea level (Vmax) ={" "}
        <span className="font-medium">??? ft/s</span>
      </p>

      <Separator className="my-4" />
      <p>
        (CL / CD)max ={" "}
        <span className="font-medium">{CLdivCD_max.toFixed(3)}</span> and
        it&apos;s velocity at sea level ={" "}
        <span className="font-medium">{velocity_1.toFixed(3)} ft/s</span>
      </p>
      <p>
        (CL^1/2 / CD)max ={" "}
        <span className="font-medium">{CL_1sur2_divCD_max.toFixed(3)}</span> and
        it&apos;s velocity at sea level ={" "}
        <span className="font-medium">{velocity_1sur2.toFixed(3)} ft/s</span>
      </p>
      <p>
        (CL^3/2 / CD)max ={" "}
        <span className="font-medium">{CL_3sur2_divCD_max.toFixed(3)}</span> and
        it&apos;s velocity at sea level ={" "}
        <span className="font-medium">{velocity_3sur2.toFixed(3)} ft/s</span>
      </p>

      <Separator className="my-4" />
      <p>
        Stall Velocity (Vstall) ={" "}
        <span className="font-medium">{stallVelocity.toFixed(3)} ft/s</span>
      </p>

      <Separator className="my-4" />
      <p>Rate of Climb curve:</p>
      <div className="h-[400px]">
        <RateOfClimbGraphe
          powerRequiredArray={powerRequiredArray}
          powerAvailableArray={powerAvailableArray}
          maxTakeOffWeight={maxTakeOffWeight}
        />
      </div>

      <Separator className="my-4" />
      <p>
        Analytically: Maximum Rate of Climb (R/C)max ={" "}
        <span className="font-medium">??? ft/s</span> and it&apos;s velocity ={" "}
        <span className="font-medium">??? ft/s</span>
      </p>

      <Separator className="my-4" />
      <p>
        Maximum climb angle: (ϴmax) = <span className="font-medium">???°</span>{" "}
        and it&apos;s velocity = <span className="font-medium">??? ft/s</span>{" "}
        and it&apos;s rate of climb ={" "}
        <span className="font-medium">??? ft/s</span>
      </p>

      {/* <Separator className="my-4" />
      <pre>Results: {JSON.stringify(???, null, 2)}</pre> */}
    </div>
  );
}

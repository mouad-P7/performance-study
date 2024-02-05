export const h_gho = [
  { h: 0, gho: 0.002377 },
  { h: 1000, gho: 0.002308 },
  { h: 2000, gho: 0.002241 },
  { h: 3000, gho: 0.002175 },
  { h: 4000, gho: 0.002111 },
  { h: 5000, gho: 0.002048 },
  { h: 6000, gho: 0.001986 },
  { h: 7000, gho: 0.001927 },
  { h: 8000, gho: 0.001868 },
  { h: 9000, gho: 0.001811 },
  { h: 10000, gho: 0.001755 },
  { h: 11000, gho: 0.001701 },
  { h: 12000, gho: 0.001648 },
  { h: 13000, gho: 0.001596 },
  { h: 14000, gho: 0.001545 },
  { h: 15000, gho: 0.001496 },
  { h: 16000, gho: 0.001448 },
  { h: 17000, gho: 0.001401 },
  { h: 18000, gho: 0.001355 },
  { h: 19000, gho: 0.001311 },
];

export const data = {
  velocityArray: [
    60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340,
    360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640,
    660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900, 920, 940,
    960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140, 1160, 1180, 1200,
    1220, 1240, 1260, 1280, 1300, 1320, 1340, 1360, 1380, 1400, 1420, 1440,
    1460, 1480, 1500, 1520, 1540, 1560, 1580, 1600,
  ], // ft/s
  PI: Math.PI,
  CD0: 0.018,
  k: 0.039,
  gho: 0.002377, // slug/ft^3
  m: 1.08,
  ghoAt1000ft: 0.001756, // slug/ft^3
};

export const aircraftFormFields = [
  {
    name: "wingSpan",
    label: "Wing Span",
    placeholder: "Unit is feet",
  },
  {
    name: "wingArea",
    label: "Wing Area",
    placeholder: "Unit is feet^2",
  },
  {
    name: "spanEfficiencyFactor",
    label: "Span Efficiency Factor",
    placeholder: "Cte",
  },
  {
    name: "liftCoefficient1",
    label: "Lift Coefficient 1",
    placeholder: "Cte",
  },
  {
    name: "liftCoefficient2",
    label: "Lift Coefficient 2",
    placeholder: "Cte",
  },
  {
    name: "alpha1",
    label: "Alpha 1",
    placeholder: "Unit is degree",
  },
  {
    name: "alpha2",
    label: "Alpha 2",
    placeholder: "Unit is degree",
  },
  {
    name: "alpha0",
    label: "Alpha 0",
    placeholder: "Unit is degree",
  },
  {
    name: "thrustAvailable",
    label: "Thrust Available",
    placeholder: "Unit is lb",
  },
  {
    name: "m",
    label: "M Coefficient",
    placeholder: "Cte",
  },
  {
    name: "maxTakeOffWeight",
    label: "Maximum Take-Off Weight",
    placeholder: "Unit is lb",
  },
  {
    name: "maxLiftCoefficient",
    label: "Maximum Lift Coefficient",
    placeholder: "Cte",
  },
  {
    name: "sweepAngle",
    label: "Sweep Angle",
    placeholder: "Unit is degree",
  },
  {
    name: "thrustSpecificFuelConsumption",
    label: "Thrust Specific Fuel Consumption",
    placeholder: "Unit is lb/hr",
  },
  {
    name: "maxUsableFuelWeight",
    label: "Maximum Usable Fuel Weight",
    placeholder: "Unit is lb",
  },
];

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AircraftForm from "./components/AircraftForm";

export default function HomePage() {
  return (
    <>
      <Alert className="p-3 mb-2">
        <AlertTitle>Important:</AlertTitle>
        <AlertDescription>
          Respect the unit described in each input.
        </AlertDescription>
      </Alert>
      <AircraftForm />
    </>
  );
}

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 h-screen flex-center flex-col gap-2">
      <Loader2 size={60} className="animate-spin" />
      <h1>Loading...</h1>
    </div>
  );
}

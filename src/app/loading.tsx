import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 w-full h-full flex justify-center items-center flex-col gap-2">
      <Loader2 size={60} className="animate-spin" />
      <h1 className="text-3xl font-semibold tracking-tight">Loading...</h1>
    </div>
  );
}

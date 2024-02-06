import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 w-full h-full flex justify-center items-center flex-col gap-6">
      <h2 className="text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        Page Not Found
      </h2>
      <p className="text-center text-3xl font-semibold tracking-tight">
        404 | This page could not be found.
      </p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}

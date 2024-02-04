"use client"; // Error components must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log({ error });
  }, [error]);

  return (
    <div className="flex-1 flex-center flex-col gap-8">
      <h1 className="h2-bold">Something went wrong!</h1>
      <div className="flex-center gap-4">
        <Link href="/">
          <Button variant="secondary">Return Home</Button>
        </Link>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}

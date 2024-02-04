import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border px-3 py-6">
      <p className="text-center text-sm font-medium leading-none">
        If you have any ideas{" "}
        <Link href="/contact-us" className="underline underline-offset-[3px]">
          contact us.
        </Link>
      </p>
    </footer>
  );
}

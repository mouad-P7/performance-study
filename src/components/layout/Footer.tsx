import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border px-3 pt-6 pb-8 flex flex-col max-sm:px-2">
      <small className="text-center text-sm font-medium leading-none">
        Comments? Feedback?{" "}
        <Link href="/contact-us" className="underline underline-offset-[3px]">
          contact us.
        </Link>
      </small>
      <br />
      <small className="text-center text-sm font-medium leading-none">
        Made with ❤ by{" "}
        <Link
          href="https://www.linkedin.com/in/mouad-ananouch-51b088229/"
          className="underline underline-offset-[3px]"
        >
          Mouad Ananouch
        </Link>{" "}
        with the help of{" "}
        <Link
          href="https://www.linkedin.com/in/houdaaitjillali/"
          className="underline underline-offset-[3px]"
        >
          Houda Ait Jillali.
        </Link>
      </small>
    </footer>
  );
}

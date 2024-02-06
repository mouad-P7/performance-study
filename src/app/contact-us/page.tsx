import Link from "next/link";

export default function ContactUsPage() {
  return (
    <div className="pt-8 flex flex-col items-center gap-12">
      <h1 className="text-center text-4xl text-primary font-extrabold tracking-tight">
        Hi, would you like to talk?
      </h1>

      <div className="flex items-center justify-center gap-12 flex-wrap">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl text-primary font-bold tracking-tight">
            Email me
          </h2>
          <Link
            href="mailto:mouadananouch7@gmail.com"
            className="underline underline-offset-[12px]"
          >
            mouadananouch7@gmail.com
          </Link>
        </div>

        {/* <div className="flex flex-col gap-4">
          <h2 className="text-2xl text-primary font-bold tracking-tight">
            Send Suggestions
          </h2>
          <Link href="" className="underline underline-offset-[12px]" >
            Submit Google Form
          </Link>
        </div> */}
      </div>
    </div>
  );
}

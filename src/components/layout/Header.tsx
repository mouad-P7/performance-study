import Logo from "@/components/shared/Logo";

export default async function Header() {
  return (
    <header>
      <nav className="flex items-center justify-center flex-wrap gap-4">
        <Logo />
      </nav>
    </header>
  );
}

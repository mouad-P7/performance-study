import Logo from "./Logo";
import DarkLightMode from "./DarkLightMode";

export default async function Header() {
  return (
    <header className="px-4 py-2 border max-sm:px-3">
      <nav className="flex items-center justify-between flex-wrap gap-4">
        <Logo />
        <DarkLightMode />
      </nav>
    </header>
  );
}

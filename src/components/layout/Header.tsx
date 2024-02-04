import Logo from "@/components/shared/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Header() {
  return (
    <header className="p-3 border">
      <nav className="flex items-center justify-between flex-wrap gap-4">
        <Logo />
      </nav>
    </header>
  );
}

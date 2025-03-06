import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <>
      <img 
        src="/images/logo.svg" 
        alt="Logo"
        className={cn("h-auto dark:hidden", className)}
      />
      <img 
        src="/images/logo-dark.svg" 
        alt="Logo"
        className={cn("h-auto hidden dark:block", className)}
      />
    </>
  );
}
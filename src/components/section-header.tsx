import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  linkText?: string;
  linkHref?: string;
}

export function SectionHeader({
  title,
  linkText,
  linkHref,
}: SectionHeaderProps) {
  return (
    <div className="w-full mb-6 sm:mb-8 flex items-center justify-between gap-3 sm:gap-4">
      <h2 className="animate animate-fadeInLeft text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground flex-1">
        {title}
      </h2>
      {linkText && linkHref && (
        <Link
          href={linkHref}
          aria-label={linkText}
          className="animate animate-fadeInRight delay-100 group inline-flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg border-2 border-primary/20 bg-primary/10 text-primary transition-all hover:border-primary/40 hover:bg-primary/20"
        >
          <ChevronRightIcon className="size-5 sm:size-6 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}


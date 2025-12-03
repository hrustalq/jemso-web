import { Calendar, BookOpen, Newspaper } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "~/components/ui/button";
import { Link } from "~/i18n/navigation";

export async function HeroSection() {
  const t = await getTranslations("HomePage.hero");

  return (
    <section className="p-6 sm:p-8 md:p-12 lg:p-16 text-center">
      {/* Content */}
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Title */}
        <h1 className="animate animate-fadeInUp text-4xl font-extrabold uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
          {t("title")}
        </h1>

        {/* Accent Line */}
        <div className="flex justify-center">
          <div className="animate animate-scaleX delay-200 h-1 w-32 bg-linear-to-r from-transparent via-primary to-transparent sm:w-48" />
        </div>

        {/* Description */}
        <p className="animate animate-fadeInUp delay-300 mx-auto max-w-3xl text-base font-medium leading-relaxed text-foreground/80 sm:text-lg md:text-xl px-2">
          {t("tagline")}
        </p>

        {/* Platform Description */}
        <div className="animate animate-fadeInUp delay-400 mx-auto max-w-3xl space-y-3 px-2">
          <p className="text-sm leading-relaxed text-foreground/70 sm:text-base md:text-lg">
            {t("description")}
          </p>
          <p className="text-xs leading-relaxed text-foreground/60 sm:text-sm md:text-base">
            {t("subdescription")}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mx-auto grid max-w-3xl gap-3 sm:gap-4 pt-2 grid-cols-1 sm:grid-cols-3">
          <div className="animate animate-fadeInUp stagger-1 group flex flex-col items-center text-center rounded-lg border border-border/40 bg-background/50 p-4 sm:p-3 backdrop-blur transition-all hover:border-primary/50 hover:bg-background/80">
            <div className="mb-3 flex h-10 w-10 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              <svg
                className="h-5 w-5 sm:h-4 sm:w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-sm sm:text-sm font-semibold text-foreground">
              {t("benefits.content.title")}
            </h3>
            <p className="text-xs text-foreground/60">
              {t("benefits.content.description")}
            </p>
          </div>

          <div className="animate animate-fadeInUp stagger-2 group flex flex-col items-center text-center rounded-lg border border-border/40 bg-background/50 p-4 sm:p-3 backdrop-blur transition-all hover:border-primary/50 hover:bg-background/80">
            <div className="mb-3 flex h-10 w-10 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              <svg
                className="h-5 w-5 sm:h-4 sm:w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-sm sm:text-sm font-semibold text-foreground">
              {t("benefits.events.title")}
            </h3>
            <p className="text-xs text-foreground/60">
              {t("benefits.events.description")}
            </p>
          </div>

          <div className="animate animate-fadeInUp stagger-3 group flex flex-col items-center text-center rounded-lg border border-border/40 bg-background/50 p-4 sm:p-3 backdrop-blur transition-all hover:border-primary/50 hover:bg-background/80">
            <div className="mb-3 flex h-10 w-10 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              <svg
                className="h-5 w-5 sm:h-4 sm:w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-sm sm:text-sm font-semibold text-foreground">
              {t("benefits.community.title")}
            </h3>
            <p className="text-xs text-foreground/60">
              {t("benefits.community.description")}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="animate animate-fadeInUp delay-600 flex flex-wrap items-center justify-center gap-3 pt-6">
          <Button
            size="default"
            className="h-10 px-5 text-sm font-medium"
            asChild
          >
            <Link href="/categories">
              <BookOpen className="mr-1.5 h-4 w-4" />
              {t("buttons.content")}
            </Link>
          </Button>
          <Button
            size="default"
            variant="outline"
            className="h-10 px-5 text-sm font-medium"
            asChild
          >
            <Link href="/events">
              <Calendar className="mr-1.5 h-4 w-4" />
              {t("buttons.events")}
            </Link>
          </Button>
          <Button
            size="default"
            variant="outline"
            className="h-10 px-5 text-sm font-medium"
            asChild
          >
            <Link href="/blog">
              <Newspaper className="mr-1.5 h-4 w-4" />
              {t("buttons.blog")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}


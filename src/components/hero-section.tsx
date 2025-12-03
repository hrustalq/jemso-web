import { Calendar, BookOpen, Newspaper, Video, Users } from "lucide-react";
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
        <h1 className="animate animate-fadeInUp text-4xl font-extrabold uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl drop-shadow-sm">
          {t("title")}
        </h1>

        {/* Accent Line */}
        <div className="flex justify-center">
          <div className="animate animate-scaleX delay-200 h-1.5 w-32 bg-linear-to-r from-transparent via-primary to-transparent sm:w-48 rounded-full" />
        </div>

        {/* Description */}
        <p className="animate animate-fadeInUp delay-300 mx-auto max-w-3xl text-base font-semibold leading-relaxed text-foreground/90 sm:text-lg md:text-xl px-2">
          {t("tagline")}
        </p>

        {/* Platform Description */}
        <div className="animate animate-fadeInUp delay-400 mx-auto max-w-3xl space-y-4 px-2">
          <p className="text-sm leading-relaxed text-foreground/80 font-medium sm:text-base md:text-lg">
            {t("description")}
          </p>
          <p className="text-xs leading-relaxed text-foreground/70 font-medium sm:text-sm md:text-base">
            {t("subdescription")}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mx-auto grid max-w-3xl gap-4 pt-4 grid-cols-1 sm:grid-cols-3">
          <div className="animate animate-fadeInUp stagger-1 group flex flex-col items-center text-center rounded-xl border border-border/50 bg-card/80 p-5 sm:p-4 backdrop-blur-sm shadow-md transition-all hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10">
            <div className="mb-3 flex h-12 w-12 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110 shadow-sm">
              <Video className="h-6 w-6 sm:h-5 sm:w-5" />
            </div>
            <h3 className="mb-2 text-sm font-bold text-foreground">
              {t("benefits.content.title")}
            </h3>
            <p className="text-xs text-foreground/70 font-medium leading-relaxed">
              {t("benefits.content.description")}
            </p>
          </div>

          <div className="animate animate-fadeInUp stagger-2 group flex flex-col items-center text-center rounded-xl border border-border/50 bg-card/80 p-5 sm:p-4 backdrop-blur-sm shadow-md transition-all hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10">
            <div className="mb-3 flex h-12 w-12 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110 shadow-sm">
              <Calendar className="h-6 w-6 sm:h-5 sm:w-5" />
            </div>
            <h3 className="mb-2 text-sm font-bold text-foreground">
              {t("benefits.events.title")}
            </h3>
            <p className="text-xs text-foreground/70 font-medium leading-relaxed">
              {t("benefits.events.description")}
            </p>
          </div>

          <div className="animate animate-fadeInUp stagger-3 group flex flex-col items-center text-center rounded-xl border border-border/50 bg-card/80 p-5 sm:p-4 backdrop-blur-sm shadow-md transition-all hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10">
            <div className="mb-3 flex h-12 w-12 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110 shadow-sm">
              <Users className="h-6 w-6 sm:h-5 sm:w-5" />
            </div>
            <h3 className="mb-2 text-sm font-bold text-foreground">
              {t("benefits.community.title")}
            </h3>
            <p className="text-xs text-foreground/70 font-medium leading-relaxed">
              {t("benefits.community.description")}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="animate animate-fadeInUp delay-600 flex flex-wrap items-center justify-center gap-3 pt-6">
          <Button
            size="default"
            className="h-11 px-6 text-sm font-bold shadow-lg shadow-primary/20"
            asChild
          >
            <Link href="/categories">
              <BookOpen className="mr-2 h-4 w-4" />
              {t("buttons.content")}
            </Link>
          </Button>
          <Button
            size="default"
            variant="outline"
            className="h-11 px-6 text-sm font-bold border-border/60 hover:border-primary/60 hover:bg-primary/5"
            asChild
          >
            <Link href="/events">
              <Calendar className="mr-2 h-4 w-4" />
              {t("buttons.events")}
            </Link>
          </Button>
          <Button
            size="default"
            variant="outline"
            className="h-11 px-6 text-sm font-bold border-border/60 hover:border-primary/60 hover:bg-primary/5"
            asChild
          >
            <Link href="/blog">
              <Newspaper className="mr-2 h-4 w-4" />
              {t("buttons.blog")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}


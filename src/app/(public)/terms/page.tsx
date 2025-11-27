import { HydrateClient } from "~/trpc/server";

export default async function TermsPage() {
  return (
    <HydrateClient>
      <main className="min-h-[var(--content-height)]" style={{ paddingTop: 'calc(var(--header-height) + var(--safe-top))' }}>
        <div className="border-b border-border/40 bg-linear-to-b from-background to-background/95">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="mb-4 text-5xl font-extrabold uppercase tracking-tight sm:text-6xl">
              Условия использования
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Ознакомьтесь с нашими условиями предоставления услуг.
            </p>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}


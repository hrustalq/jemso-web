import Image from "next/image";

interface CategoryHeroProps {
  category: {
    name: string;
    description: string | null;
    coverImage: string | null;
    color: string | null;
  };
}

export function CategoryHero({ category }: CategoryHeroProps) {
  return (
    <section
      className="relative py-12 md:py-16 lg:py-20"
      style={{
        backgroundColor: category.color
          ? `${category.color}20`
          : "hsl(var(--muted))",
      }}
    >
      {category.coverImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={category.coverImage}
            alt={category.name}
            fill
            className="object-cover opacity-20"
          />
        </div>
      )}
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-3xl">
          <h1
            className="text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
            style={{
              color: category.color ?? undefined,
            }}
          >
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg md:text-xl">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}


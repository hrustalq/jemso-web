import { cn } from "~/lib/utils";

interface PageWrapperProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  withHeaderOffset?: boolean;
}

export function PageWrapper({ 
  children, 
  className, 
  style, 
  withHeaderOffset = true,
  ...props 
}: PageWrapperProps) {
  return (
    <main 
      className={cn("min-h-(--content-height)", className)} 
      style={{ 
        paddingTop: withHeaderOffset ? 'calc(var(--header-height) + var(--safe-top))' : undefined,
        ...style 
      }}
      {...props}
    >
      {children}
    </main>
  );
}


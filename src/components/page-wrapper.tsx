import { cn } from "~/lib/utils";

interface PageWrapperProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  withHeaderOffset?: boolean;
}

export function PageWrapper({ 
  children, 
  className, 
  withHeaderOffset = true,
  ...props 
}: PageWrapperProps) {
  return (
    <main 
      className={cn(
        "min-h-(--content-height)",
        withHeaderOffset && "page-pt",
        className
      )} 
      {...props}
    >
      {children}
    </main>
  );
}


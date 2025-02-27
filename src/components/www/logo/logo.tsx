import { cn } from "~/lib/utils";

export default function Logo(props: { className?: string }) {
  return (
    <span className={cn("font-koulen text-3xl text-primary", props.className)}>
      CARBOOK
    </span>
  );
}

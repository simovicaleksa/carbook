import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "./button";
import { cn } from "~/lib/utils";

type LoadingButtonProps = {
  isLoading?: boolean;
  loadingText?: string;
} & ButtonProps;

export default function LoadingButton(props: LoadingButtonProps) {
  const { children, className, isLoading, loadingText, ...rest } = props;

  const isDisabled = props.disabled ? true : isLoading;

  return (
    <Button
      {...rest}
      disabled={isDisabled}
      className={cn("flex flex-row items-center gap-2", className)}
    >
      <Loader2 className="size-4" />
      {isLoading && loadingText?.length ? loadingText : children}
    </Button>
  );
}

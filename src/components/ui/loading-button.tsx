import { Loader2 } from "lucide-react";

import { cn } from "~/lib/utils";

import { Button, type ButtonProps } from "./button";

type LoadingButtonProps = {
  isLoading: boolean;
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
      {isLoading && <Loader2 className="size-4 animate-spin" />}
      {isLoading && loadingText?.length ? loadingText : children}
    </Button>
  );
}

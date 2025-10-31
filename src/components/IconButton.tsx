import type { ComponentProps, JSX } from "solid-js";
import { cn } from "../util/cn";

interface IconButtonProps extends ComponentProps<"button"> {
  icon: JSX.Element;
}

export function IconButton(props: IconButtonProps) {
  return (
    <button
      {...props}
      class={cn(
        "bg-background-higher text-foreground-muted size-9 cursor-default rounded-full p-2 not-disabled:cursor-pointer [&>*]:h-full [&>*]:w-full",
        props.class,
      )}
    >
      {props.icon}
    </button>
  );
}

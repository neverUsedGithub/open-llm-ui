import {
  children,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  Show,
  useContext,
  type JSX,
} from "solid-js";
import { cn } from "../util/cn";

const DropdownContext = createContext<{
  open: () => void;
  close: () => void;
  isOpen: () => boolean;

  contentElement: HTMLElement | null;
}>();

export function Dropdown(props: { children: JSX.Element }) {
  const [isOpen, setIsOpen] = createSignal(false);

  const context = {
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    isOpen,

    contentElement: null,
  };

  return (
    <DropdownContext.Provider value={context}>
      <div class="relative">{props.children}</div>
    </DropdownContext.Provider>
  );
}

Dropdown.Trigger = function DropdownTrigger(props: { children: JSX.Element }) {
  const ctx = useContext(DropdownContext)!;
  const resolved = children(() => props.children);

  createEffect(() => {
    const childrenJSX = resolved();
    const children = Array.isArray(childrenJSX) ? childrenJSX : [childrenJSX];

    for (const child of children) {
      if (child instanceof HTMLElement) child.addEventListener("click", dropdownInteract);
    }
  });

  onMount(() => {
    window.addEventListener("click", clickOut);
  });

  onCleanup(() => {
    window.removeEventListener("click", clickOut);
  });

  function clickOut(ev: MouseEvent) {
    const childrenJSX = resolved();
    const children = Array.isArray(childrenJSX) ? childrenJSX : [childrenJSX];

    let contains = ctx.contentElement?.contains(ev.target as Node) ?? false;

    if (!contains) {
      for (const child of children) {
        if (child instanceof HTMLElement) {
          if (child.contains(ev.target! as Node)) {
            contains = true;
            break;
          }
        }
      }
    }

    if (!contains) {
      ctx.close();
    }
  }

  function dropdownInteract() {
    if (ctx.isOpen()) ctx.close();
    else ctx.open();
  }

  return <>{resolved()}</>;
};

Dropdown.Content = function DropdownContent(props: { children: JSX.Element }) {
  const ctx = useContext(DropdownContext)!;

  ctx.contentElement = (
    <div class="bg-background-default border-background-higher absolute bottom-14 -left-3 flex w-64 flex-col rounded-2xl border-1 px-1.5 py-1.5">
      {props.children}
    </div>
  ) as HTMLElement;

  return <Show when={ctx.isOpen()}>{ctx.contentElement}</Show>;
};

Dropdown.Item = function DropdownItem(props: {
  children: JSX.Element;
  disabled?: boolean;
  class?: string;
  onSelect?: () => void;
}) {
  const ctx = useContext(DropdownContext)!;

  function selectItem() {
    props.onSelect?.();
    ctx.close();
  }

  return (
    <button
      onClick={selectItem}
      class={cn(
        "not-disabled:hover:bg-background-higher disabled:text-foreground-muted flex not-disabled:cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left",
        props.class,
      )}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

Dropdown.Separator = function DropdownSeparator() {
  return <div class="border-background-highest my-2 w-full border-b"></div>;
};

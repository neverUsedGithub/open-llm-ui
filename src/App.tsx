import { For, type JSX } from "solid-js";
import { ChatView } from "./Chat";

import NotebookPen from "lucide-solid/icons/notebook-pen";
import EllipsisIcon from "lucide-solid/icons/ellipsis";
import TrashIcon from "lucide-solid/icons/trash-2";

import { ChatManager } from "./chatmanager/ChatManager";
import { Dropdown } from "./components/Dropdown";
import { cn } from "./util/cn";

function ChatItem(props: { children: JSX.Element; onClick: () => void; class?: string }) {
  let chatItemElement!: HTMLButtonElement;

  function chatItemClick(ev: Event) {
    if (ev.target === chatItemElement) {
      props.onClick();
    }
  }

  return (
    <button
      class={cn("flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-zinc-800", props.class)}
      onClick={chatItemClick}
      ref={chatItemElement}
    >
      {props.children}
    </button>
  );
}

export default function App() {
  const chatManager = ChatManager.getInstance();

  return (
    <div class="flex">
      <div class="flex w-[255px] flex-col gap-2 border-r border-zinc-800 p-2">
        <div class="flex flex-col">
          <ChatItem onClick={() => chatManager.createNewChat()}>
            <NotebookPen size={18} />
            New chat
          </ChatItem>
        </div>
        <div class="flex flex-col">
          <For each={chatManager.chats()}>
            {(chat) => (
              <ChatItem
                class="justify-between not-hover:[&>:nth-child(2)>:nth-child(1)]:opacity-0"
                onClick={() => chatManager.setOpenChat(chat.id)}
              >
                <span>{chat.name()}</span>
                <Dropdown>
                  <Dropdown.Trigger>
                    <button class="cursor-pointer">
                      <EllipsisIcon class="size-4" />
                    </button>
                  </Dropdown.Trigger>
                  <Dropdown.Content>
                    <Dropdown.Item variant="destructive" onSelect={() => chatManager.deleteChat(chat.id)}>
                      <TrashIcon class="size-4" />
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown>
              </ChatItem>
            )}
          </For>
        </div>
      </div>
      <ChatView chat={chatManager.currentChat()} selectedModel="qwen3:30b-a3b-instruct-2507-q4_K_M" />
    </div>
  );
}

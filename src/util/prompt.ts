import { baseSystemPrompt, dayNames, toolSystemPrompt } from "./constant";
import { replacePlaceholders } from "./placeholder";
import type { ModelTool } from "@/types";

function replacePromptPlaceholders(prompt: string, tools?: ModelTool[]) {
  const currentDate = new Date();
  const weekdayName = dayNames[currentDate.getDay()];

  const displayTools: any[] = [...(tools ?? [])];

  for (let i = 0; i < displayTools.length; i++) {
    displayTools[i] = { ...displayTools[i] };

    delete displayTools[i]["icon"];
    delete displayTools[i]["execute"];
    delete displayTools[i]["isSupported"];
  }

  const substitutions = {
    DATE_YEAR: currentDate.getFullYear(),
    DATE_MONTH: currentDate.getMonth() + 1,
    DATE_DAY: currentDate.getDate(),

    DATE_WEEKDAY: currentDate.getDay(),
    DATE_WEEKDAY_NAME: weekdayName,

    TIME_HOURS: currentDate.getHours(),
    TIME_MINUTES: currentDate.getMinutes(),

    TOOLS: JSON.stringify(displayTools, null, 2),
  };

  return replacePlaceholders(prompt, substitutions);
}

interface SystemPromptOpts {
  tools?: ModelTool[];
}

export function buildSystemPrompt(opts: SystemPromptOpts) {
  let prompt = baseSystemPrompt;
  if (opts.tools) prompt += "\n" + toolSystemPrompt;

  return replacePromptPlaceholders(prompt, opts.tools);
}

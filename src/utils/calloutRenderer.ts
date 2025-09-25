import { callouts } from "../data/callouts";

export function preprocessCallouts(content: string): string {
  // Add markers to blockquotes so we can identify them after marked processing
  return content.replace(/^((?:>\s*.*\n?)+)/gm, (match) => {
    // Extract content from blockquote
    const content = match.replace(/^>\s*/gm, "").trim();

    // Check for callout syntax
    const calloutMatch =
      content.match(/^\[!(note|warning|important)\]\s*([\s\S]*)$/i) ||
      content.match(/^(note|warning|important):\s*([\s\S]*)$/i);

    let calloutType = "note";
    let actualContent = content;

    if (calloutMatch) {
      calloutType = calloutMatch[1].toLowerCase();
      actualContent = calloutMatch[2].trim();
    }

    // Return markdown blockquote with special markers
    const lines = actualContent.split("\n");
    const markedLines = lines.map((line) => `> ${line}`).join("\n");

    return `<!-- CALLOUT_START:${calloutType} -->\n${markedLines}\n<!-- CALLOUT_END -->\n`;
  });
}

export function postprocessCallouts(content: string): string {
  return content.replace(
    /<!-- CALLOUT_START:(\w+) -->\s*<blockquote>\s*([\s\S]*?)\s*<\/blockquote>\s*<!-- CALLOUT_END -->/g,
    (match, type, content) => {
      const calloutConfig = callouts[type];
      if (!calloutConfig) return match;

      return `<blockquote class="${calloutConfig.className}">
<i class="${calloutConfig.icon}" style="position: absolute; top: 1rem; left: 1rem; font-size: 1rem;"></i>
${content}
</blockquote>`;
    },
  );
}

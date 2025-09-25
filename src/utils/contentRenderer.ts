import { marked } from "marked";

export function contentRenderer(
  content: string,
  preprocesses: Function[],
  postprocesses: Function[],
) {
  let processedContent = content;

  // Apply all preprocessors
  for (const preprocess of preprocesses) {
    processedContent = preprocess(processedContent);
  }

  // Convert markdown to HTML
  const markedContent = marked(processedContent);

  // Apply all postprocessors
  for (const postprocess of postprocesses) {
    processedContent = postprocess(markedContent);
  }

  return processedContent;
}

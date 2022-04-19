import type { I7CompilerVersion } from "services/projects/inform7/inform7ProjectService";

// how many characters a snippet can contain
export const SNIPPET_MAX_CHARACTERS = 12000;

// the default I7 version must always be 6M62 because snippets have been published using 6M62 without saving the version data
export const SNIPPET_DEFAULT_I7_VERSION: I7CompilerVersion = "6M62";

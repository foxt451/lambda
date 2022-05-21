import { resources, extractors } from "./endpoints.js";
import { getIsDoneForAll } from "./isDoneChecker.js";

getIsDoneForAll(resources, extractors)

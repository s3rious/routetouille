import { createNanoEvents } from "nanoevents";
import type { HistoryInterface } from "../index.js";

function getPathName(): string {
  const locationPathname: string = window.location.pathname;
  const locationSearch: string = window.location.search;
  const locationHash: string = window.location.hash;
  return locationPathname + locationSearch + locationHash;
}

function BrowserHistory(): HistoryInterface {
  const pathname: string = getPathName();
  const emitter = createNanoEvents();

  function push(
    this: HistoryInterface,
    pathname: string | null,
    state?: unknown,
  ): void {
    if (pathname != null) {
      window.history.pushState(state ?? null, "", pathname);
      this.pathname = pathname;

      emitter.emit("push", pathname, state);
      emitter.emit("change", pathname, state);
    }
  }

  function replace(
    this: HistoryInterface,
    pathname: string | null,
    state?: unknown,
  ): void {
    if (pathname != null) {
      window.history.replaceState(state ?? null, "", pathname);
      this.pathname = pathname;

      emitter.emit("replace", pathname, state);
      emitter.emit("change", pathname, state);
    }
  }

  function onPopState(this: Window, event: PopStateEvent): void {
    const pathname: string = getPathName();

    emitter.emit("popstate", pathname, event?.state);
    emitter.emit("change", pathname, event?.state);
  }

  window.addEventListener("popstate", onPopState);

  return { pathname, push, replace, emitter };
}

export { BrowserHistory };

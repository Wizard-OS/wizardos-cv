/** Bind once per rendered page and release listeners before Astro swaps the DOM. */
export function onPageLoad(setup: (signal: AbortSignal) => void | (() => void)) {
  let controller: AbortController | undefined;
  let teardown: (() => void) | void;
  const dispose = () => {
    controller?.abort();
    teardown?.();
    controller = undefined;
    teardown = undefined;
  };
  document.addEventListener('astro:page-load', () => {
    dispose();
    controller = new AbortController();
    teardown = setup(controller.signal);
  });
  document.addEventListener('astro:before-swap', dispose);
}

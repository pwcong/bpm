export function postEvent(name: string, detail?: any) {
  window.dispatchEvent(
    new CustomEvent(name, {
      detail
    })
  );
}

export function postEvent(name: string) {
  window.dispatchEvent(new CustomEvent(name));
}

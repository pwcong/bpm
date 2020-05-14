export function postEvent(name: string, detail?: any) {
  window.dispatchEvent(
    new CustomEvent(name, {
      detail,
    })
  );
}

export function getEvent(name: string, callback: any) {
  window.addEventListener(name, callback);
}

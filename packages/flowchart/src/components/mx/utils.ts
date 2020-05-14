export function getBasePath(path?: string) {
  return `./static${path ? '/' + path : ''}`;
}

export function getImageBasePath(path?: string) {
  return `./static/images${path ? '/' + path : ''}`;
}

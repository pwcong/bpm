export function getBasePath(path?: string) {
  return `./static/mxgraph${path ? '/' + path : ''}`;
}

export function getImageBasePath(path?: string) {
  return `./static/mxgraph/images${path ? '/' + path : ''}`;
}

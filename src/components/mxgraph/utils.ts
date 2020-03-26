export function getBasePath(path?: string) {
  return `./mxgraph${path ? '/' + path : ''}`;
}

export function getImageBasePath(path?: string) {
  return `./mxgraph/images${path ? '/' + path : ''}`;
}

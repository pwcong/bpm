import { IBaseConfig } from '../../types';
import { parseJSON } from '../../utils';

export function getValidator(config: IBaseConfig, graph, cell, action: string) {
  const { toolbar } = config;

  return ((toolbar.map[parseJSON(graph.model.getValue(cell), {}).key] || {})
    .validations || {})[action];
}

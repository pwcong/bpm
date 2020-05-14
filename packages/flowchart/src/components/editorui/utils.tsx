import { parseJSON } from '@bpm/utils';

import { IBaseConfig } from '../../types';

export function getValidator(config: IBaseConfig, graph, cell, action: string) {
  const { toolbar } = config;

  return ((toolbar.map[parseJSON(graph.model.getValue(cell), {}).key] || {})
    .validations || {})[action];
}

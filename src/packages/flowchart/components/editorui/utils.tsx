import { IChartConfig } from '../../types';
import { parseJSON } from '../../utils';

export function getValidator(
  config: IChartConfig,
  graph,
  cell,
  action: string
) {
  const { toolbar } = config;

  const key = parseJSON(graph.model.getValue(cell), {}).key;

  return ((toolbar.map[key] || {}).validations || {})[action];
}

export function validate(config: IChartConfig, graph, cell, action: string) {
  const validator = getValidator(config, graph, cell, action);
  return !!validator ? validator() : true;
}

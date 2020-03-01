export interface IMxGraphFactory {
  mxGraph: IMxGraph;
  mxClient: IMxClient;
}

export interface IMxEventSource {
  new (eventSource: any): IMxEventSource;
  eventSource: any;
  eventsEnabled: boolean;
  eventListeners: Array<any> | null;
  isEventsEnabled(): boolean;
  setEventsEnabled(value: boolean): void;
  getEventSource(): any;
  setEventSource(value: any): void;
  addListener(name: string, funct: Function): void;
  removeListener(funct: Function): void;
  fireEvent(evt: IMxEventObject, sender: any | null): void;
}

export interface IMxEventObject {
  new (name: string): IMxEventObject;
  properties: Array<any>;
  name: string;
  consumed: boolean;
  getName: string;
  getProperties(): Array<any>;
  getProperty(key: string): any;
  isConsumed(): boolean;
  consume(): void;
}

export interface IMxClient {
  isBrowserSupported(): boolean;
}

export interface IMxEvent {
  disableContextMenu(element: HTMLElement): void;
}

export interface IxRubberband {
  new (graph: IMxGraph): IxRubberband;
}

export interface IMxGraphModal {
  new (root: IMxCell): IMxGraphModal;
  beginUpdate(): void;
  endUpdate(): void;
}

export interface IMxGraphSelectionModel {}

export interface IMxCellPath {}

export interface IMxRectangle {
  new (x: number, y: number, width: number, height: number): IMxRectangle;
}

export interface IMxGeometry extends IMxRectangle {
  new (x: number, y: number, width: number, height: number): IMxGeometry;
}

export interface IMxCell {
  /*
   * value - Optional object that represents the cell value.
   * geometry - Optional <mxGeometry> that specifies the geometry.
   * style - Optional formatted string that defines the style.
   */
  new (
    value: object | null,
    geometry: IMxGeometry | null,
    style: string | null
  ): IMxCell;
}

export interface IMxCellEditor {}

export interface IMxCellRenderer {}

export interface IMxGraphView {
  new (graph: IMxGraph): IMxGraphView;
  currentRoot: IMxCell | null;
}

export interface IMxStylesheet {}

export interface IMxMultiplicity {}

export interface IMxGraph extends IMxEventSource {
  /*
   * container - Optional DOM node that acts as a container for the graph.
   * If this is null then the container can be initialized later using
   * <init>.
   * model - Optional <mxGraphModel> that constitutes the graph data.
   * renderHint - Optional string that specifies the display accuracy and
   * performance. Default is mxConstants.DIALECT_MIXEDHTML (for IE).
   * stylesheet - Optional <mxStylesheet> to be used in the graph.
   */
  new (
    container: HTMLElement | null,
    model: IMxGraphModal | null,
    renderHint: string | null,
    stylesheet: IMxStylesheet | null
  ): IMxGraph;
  mouseListeners: Array<any> | null;
  isMouseDown: boolean;
  model: IMxGraphModal | null;
  view: IMxGraphView | null;
  stylesheet: IMxStylesheet | null;
  selectionModel: IMxGraphSelectionModel | null;
  cellEditor: IMxCellEditor | null;
  cellRenderer: IMxCellRenderer | null;
  multiplicities: Array<IMxMultiplicity> | null;
  renderHint: string | null;
  getCurrentRoot(): IMxCell;
  getDefaultParent(): IMxCell;
  getModel(): IMxGraphModal;
  /*
   *
   * Adds a new vertex into the given parent <mxCell> using value as the user
   * object and the given coordinates as the <mxGeometry> of the new vertex.
   * The id and style are used for the respective properties of the new
   * <mxCell>, which is returned.
   *
   * When adding new vertices from a mouse event, one should take into
   * account the offset of the graph container and the scale and translation
   * of the view in order to find the correct unscaled, untranslated
   * coordinates using <mxGraph.getPointForEvent> as follows:
   *
   * (code)
   * var pt = graph.getPointForEvent(evt);
   * var parent = graph.getDefaultParent();
   * graph.insertVertex(parent, null,
   * 			'Hello, World!', x, y, 220, 30);
   * (end)
   *
   * For adding image cells, the style parameter can be assigned as
   *
   * (code)
   * stylename;image=imageUrl
   * (end)
   *
   * See <mxGraph> for more information on using images.
   *
   * Parameters:
   *
   * parent - <mxCell> that specifies the parent of the new vertex.
   * id - Optional string that defines the Id of the new vertex.
   * value - Object to be used as the user object.
   * x - Integer that defines the x coordinate of the vertex.
   * y - Integer that defines the y coordinate of the vertex.
   * width - Integer that defines the width of the vertex.
   * height - Integer that defines the height of the vertex.
   * style - Optional string that defines the cell style.
   * relative - Optional boolean that specifies if the geometry is relative.
   * Default is false.
   */
  insertVertex(
    parent: IMxCell,
    id: string | null,
    value: object | null,
    x: number,
    y: number,
    width: number,
    height: number,
    style: string | null,
    relative: boolean | null
  ): IMxCell;
  /**
   * Adds a new edge into the given parent <mxCell> using value as the user
   * object and the given source and target as the terminals of the new edge.
   * The id and style are used for the respective properties of the new
   * <mxCell>, which is returned.
   *
   * Parameters:
   *
   * parent - <mxCell> that specifies the parent of the new edge.
   * id - Optional string that defines the Id of the new edge.
   * value - JavaScript object to be used as the user object.
   * source - <mxCell> that defines the source of the edge.
   * target - <mxCell> that defines the target of the edge.
   * style - Optional string that defines the cell style.
   */
  insertEdge(
    parent: IMxCell,
    id: string | null,
    value: object | null,
    source: IMxCell,
    target: IMxCell,
    style: string | null
  ): IMxCell;
  /*
   * Adds the cell to the parent and connects it to the given source and
   * target terminals. This is a shortcut method. Returns the cell that was
   * added.
   *
   * Parameters:
   *
   * cell - <mxCell> to be inserted into the given parent.
   * parent - <mxCell> that represents the new parent. If no parent is
   * given then the default parent is used.
   * index - Optional index to insert the cells at. Default is to append.
   * source - Optional <mxCell> that represents the source terminal.
   * target - Optional <mxCell> that represents the target terminal.
   */
  addCell(
    cell: IMxCell,
    parent: IMxCell | null,
    index: number | null,
    source: IMxCell | null,
    target: IMxCell | null
  ): IMxCell;
  /**
   * Adds the cells to the parent at the given index, connecting each cell to
   * the optional source and target terminal. The change is carried out using
   * <cellsAdded>. This method fires <mxEvent.ADD_CELLS> while the
   * transaction is in progress. Returns the cells that were added.
   *
   * Parameters:
   *
   * cells - Array of <mxCells> to be inserted.
   * parent - <mxCell> that represents the new parent. If no parent is
   * given then the default parent is used.
   * index - Optional index to insert the cells at. Default is to append.
   * source - Optional source <mxCell> for all inserted cells.
   * target - Optional target <mxCell> for all inserted cells.
   * absolute - Optional boolean indicating of cells should be kept at
   * their absolute position. Default is false.
   */
  addCells(
    cells: Array<IMxCell>,
    parent: IMxCell | null,
    index: number | null,
    source: IMxCell | null,
    target: IMxCell | null,
    absolute: boolean | null
  ): Array<IMxCell>;
  /**
   * Adds the edge to the parent and connects it to the given source and
   * target terminals. This is a shortcut method. Returns the edge that was
   * added.
   *
   * Parameters:
   *
   * edge - <mxCell> to be inserted into the given parent.
   * parent - <mxCell> that represents the new parent. If no parent is
   * given then the default parent is used.
   * source - Optional <mxCell> that represents the source terminal.
   * target - Optional <mxCell> that represents the target terminal.
   * index - Optional index to insert the cells at. Default is to append.
   */
  addEdge(
    edge: IMxCell,
    parent: IMxCell | null,
    source: IMxCell | null,
    target: IMxCell | null,
    index: number | null
  ): IMxCell;
  /**
   * Hook method that creates the new edge for <insertEdge>. This
   * implementation does not set the source and target of the edge, these
   * are set when the edge is added to the model.
   */
  createEdge(
    parent: IMxCell | null,
    id: string | null,
    value: object | null,
    source: IMxCell | null,
    target: IMxCell | null,
    style: string | null
  ): IMxCell;
  // TODO 用到再补充
}

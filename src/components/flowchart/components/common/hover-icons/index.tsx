import {
  mxUtils,
  mxImage,
  mxClient,
  mxResources,
  mxEvent,
  mxConstants,
  mxRectangle
} from '@/components/mxgraph';
import { getImageBasePath } from '@/components/mxgraph/utils';

/**
 * Hover icons are used for hover, vertex handler and drag from sidebar.
 */
function HoverIcons(graph, clickHandler) {
  this.graph = graph;
  this.clickHandler = clickHandler;

  this.init();
}

/**
 * Up arrow.
 */
HoverIcons.prototype.arrowSpacing = 2;

/**
 * Delay to switch to another state for overlapping bbox. Default is 500ms.
 */
HoverIcons.prototype.updateDelay = 500;

/**
 * Delay to switch between states. Default is 140ms.
 */
HoverIcons.prototype.activationDelay = 140;

/**
 * Up arrow.
 */
HoverIcons.prototype.currentState = null;

/**
 * Up arrow.
 */
HoverIcons.prototype.activeArrow = null;

/**
 * Up arrow.
 */
HoverIcons.prototype.inactiveOpacity = 15;

/**
 * Up arrow.
 */
HoverIcons.prototype.cssCursor = 'copy';

/**
 * Whether to hide arrows that collide with vertices.
 * LATER: Add keyboard override, touch support.
 */
HoverIcons.prototype.checkCollisions = true;

/**
 * Up arrow.
 */
HoverIcons.prototype.arrowFill = '#29b6f2';

/**
 * Up arrow.
 */
HoverIcons.prototype.triangleUp = new mxImage(
  getImageBasePath('triangle-up.svg'),
  14,
  24
);

/**
 * Right arrow.
 */
HoverIcons.prototype.triangleRight = new mxImage(
  getImageBasePath('triangle-right.svg'),
  24,
  14
);

/**
 * Down arrow.
 */
HoverIcons.prototype.triangleDown = new mxImage(
  getImageBasePath('triangle-down.svg'),
  14,
  24
);

/**
 * Left arrow.
 */
HoverIcons.prototype.triangleLeft = new mxImage(
  getImageBasePath('triangle-left.svg'),
  24,
  14
);

/**
 * Round target.
 */
HoverIcons.prototype.roundDrop = new mxImage(
  getImageBasePath('round-drop.png'),
  26,
  26
);

/**
 * Refresh target.
 */
HoverIcons.prototype.refreshTarget = new mxImage(
  mxClient.IS_SVG
    ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDQxNERDRTU1QjY1MTFFNDkzNTRFQTVEMTdGMTdBQjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDQxNERDRTY1QjY1MTFFNDkzNTRFQTVEMTdGMTdBQjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NDE0RENFMzVCNjUxMUU0OTM1NEVBNUQxN0YxN0FCNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0NDE0RENFNDVCNjUxMUU0OTM1NEVBNUQxN0YxN0FCNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsvuX50AAANaSURBVHja7FjRZ1tRGD9ZJ1NCyIQSwrivI4Q8hCpjlFDyFEoYfSp9Ko1QWnmo0If+BSXkIfo0QirTMUpeGo2EPfWllFYjZMLKLDJn53d3biU337m5J223bPbxk5t7v+/c3/2+73znO8fDOWezKM/YjMpz68Lj8ejY+QTeCCwLxOS9qPxtyN+6wAeBTwJ31CCO0cJDjXBGBN4LfIepSwykTUT1bgpuib0SONIgo8KRHOtRiCFcvUcgZeGrHPNBxLIyFPyRgTGz0xLbegJCdmzpElue5KlAIMDX19d5uVzm5+fnfDAYmMA17uEZdOx2Yvb/sHlu2S0xwymn5ufneTab5b1ej08S6EAXNrDd2dnhiUTim21MvMtwQ6yiIrWwsMDPzs64rsBmf3/fvM7n89TYlUnEllSkQqEQv7q64g+Vk5MTVXosORErU0Zer5f0FEIlw2N6MxwO82QyaXql2+2SxDqdjopYWUUsqEp45IldqtWq6UWVh/1+P7+8vCTJ4QMUJSRIEXuneoH96w8PDyeWAnhSJfCqwm6NIlaklFdXV0cGhRcQ2mlJQXK5nMq2YPEZbnteU1U2lUqN/D84OGD9fl+5fgnSrFarsUwmw0qlEru4uBjTicViTk3Cr27HSnxR+Doyz0ZE1CAWiUTusbu7y9rttlZv5fP5WDQavYfIMba4uEipfhF8XtqJoZXx/uH+sC/4vPg7OljZZQbsCmLtYzc3N6zRaJhotVrmfx0xDINtbm6athYUeXpHdbBNaqZUKpWxWXV7e2vex+xaWVnhc3NzjrPUXgexyCt0m67LBV7uJMITjqRE4o8tZeg8FPpFitgapYxiOC0poFgsji1jKNo6BZZckrAGUtJsNk1vqAihCBcKhTE7hNWhqw2qFnGy5UFOUYJVIJ1OjzSE+BCEilon0URavRmBqnbbQ00AXbm+vnZc9O1tj72OnQoc2+cwygRkb2+P1et17ZoEm3g87lRmjgWZ00kbXkNuse6/Bu2wlegIxfb2tuvWGroO4bO2c4bbzUh60mxDXm1sbJhhxkQYnhS4h2fUZoRAWnf7lv8N27f8P7Xhnekjgpk+VKGOoQbsiY+hhhtF3YO7twIJ+ULvUGv+GQ2fQEvWxI/THNx5/p/BaspPAQYAqStgiSQwCDoAAAAASUVORK5CYII='
    : getImageBasePath('refresh.png'),
  38,
  38
);

/**
 * Tolerance for hover icon clicks.
 */
HoverIcons.prototype.tolerance = mxClient.IS_TOUCH ? 6 : 0;

/**
 *
 */
HoverIcons.prototype.init = function() {
  this.arrowUp = this.createArrow(
    this.triangleUp,
    mxResources.get('plusTooltip')
  );
  this.arrowRight = this.createArrow(
    this.triangleRight,
    mxResources.get('plusTooltip')
  );
  this.arrowDown = this.createArrow(
    this.triangleDown,
    mxResources.get('plusTooltip')
  );
  this.arrowLeft = this.createArrow(
    this.triangleLeft,
    mxResources.get('plusTooltip')
  );

  this.elts = [this.arrowUp, this.arrowRight, this.arrowDown, this.arrowLeft];

  this.resetHandler = mxUtils.bind(this, function() {
    this.reset();
  });

  this.repaintHandler = mxUtils.bind(this, function() {
    this.repaint();
  });

  this.graph.selectionModel.addListener(mxEvent.CHANGE, this.resetHandler);
  this.graph.model.addListener(mxEvent.CHANGE, this.repaintHandler);
  this.graph.view.addListener(mxEvent.SCALE_AND_TRANSLATE, this.repaintHandler);
  this.graph.view.addListener(mxEvent.TRANSLATE, this.repaintHandler);
  this.graph.view.addListener(mxEvent.SCALE, this.repaintHandler);
  this.graph.view.addListener(mxEvent.DOWN, this.repaintHandler);
  this.graph.view.addListener(mxEvent.UP, this.repaintHandler);
  this.graph.addListener(mxEvent.ROOT, this.repaintHandler);
  this.graph.addListener(mxEvent.ESCAPE, this.resetHandler);
  mxEvent.addListener(this.graph.container, 'scroll', this.resetHandler);

  // Resets the mouse point on escape
  this.graph.addListener(
    mxEvent.ESCAPE,
    mxUtils.bind(this, function() {
      this.mouseDownPoint = null;
    })
  );

  // Removes hover icons if mouse leaves the container
  mxEvent.addListener(
    this.graph.container,
    'mouseleave',
    mxUtils.bind(this, function(evt) {
      // Workaround for IE11 firing mouseleave for touch in diagram
      if (
        evt.relatedTarget != null &&
        mxEvent.getSource(evt) === this.graph.container
      ) {
        this.setDisplay('none');
      }
    })
  );

  // Resets current state when in-place editor starts
  this.graph.addListener(
    mxEvent.START_EDITING,
    mxUtils.bind(this, function(evt) {
      this.reset();
    })
  );

  // Resets current state after update of selection state for touch events
  const graphClick = this.graph.click;
  this.graph.click = mxUtils.bind(this, function(me) {
    graphClick.apply(this.graph, arguments);

    if (
      this.currentState != null &&
      !this.graph.isCellSelected(this.currentState.cell) &&
      mxEvent.isTouchEvent(me.getEvent()) &&
      !this.graph.model.isVertex(me.getCell())
    ) {
      this.reset();
    }
  });

  // Checks if connection handler was active in mouse move
  // as workaround for possible double connection inserted
  let connectionHandlerActive = false;

  // Implements a listener for hover and click handling
  this.graph.addMouseListener({
    mouseDown: mxUtils.bind(this, function(sender, me) {
      connectionHandlerActive = false;
      const evt = me.getEvent();

      if (this.isResetEvent(evt)) {
        this.reset();
      } else if (!this.isActive()) {
        const state = this.getState(me.getState());

        if (state != null || !mxEvent.isTouchEvent(evt)) {
          this.update(state);
        }
      }

      this.setDisplay('none');
    }),
    mouseMove: mxUtils.bind(this, function(sender, me) {
      const evt = me.getEvent();

      if (this.isResetEvent(evt)) {
        this.reset();
      } else if (!this.graph.isMouseDown && !mxEvent.isTouchEvent(evt)) {
        this.update(
          this.getState(me.getState()),
          me.getGraphX(),
          me.getGraphY()
        );
      }

      if (
        this.graph.connectionHandler != null &&
        this.graph.connectionHandler.shape != null
      ) {
        connectionHandlerActive = true;
      }
    }),
    mouseUp: mxUtils.bind(this, function(sender, me) {
      const evt = me.getEvent();
      // const pt = mxUtils.convertPoint(
      //   this.graph.container,
      //   mxEvent.getClientX(evt),
      //   mxEvent.getClientY(evt)
      // )

      if (this.isResetEvent(evt)) {
        this.reset();
      } else if (
        this.isActive() &&
        !connectionHandlerActive &&
        this.mouseDownPoint != null
      ) {
        this.click(this.currentState, this.getDirection(), me);
      } else if (this.isActive()) {
        // Selects target vertex after drag and clone if not only new edge was inserted
        if (
          this.graph.getSelectionCount() !== 1 ||
          !this.graph.model.isEdge(this.graph.getSelectionCell())
        ) {
          this.update(
            this.getState(
              this.graph.view.getState(
                this.graph.getCellAt(me.getGraphX(), me.getGraphY())
              )
            )
          );
        } else {
          this.reset();
        }
      } else if (
        mxEvent.isTouchEvent(evt) ||
        (this.bbox != null &&
          mxUtils.contains(this.bbox, me.getGraphX(), me.getGraphY()))
      ) {
        // Shows existing hover icons if inside bounding box
        this.setDisplay('');
        this.repaint();
      } else if (!mxEvent.isTouchEvent(evt)) {
        this.reset();
      }

      connectionHandlerActive = false;
      this.resetActiveArrow();
    })
  });
};

/**
 *
 */
HoverIcons.prototype.isResetEvent = function(evt, allowShift) {
  return (
    mxEvent.isAltDown(evt) ||
    (this.activeArrow == null && mxEvent.isShiftDown(evt)) ||
    mxEvent.isMetaDown(evt) ||
    (mxEvent.isPopupTrigger(evt) && !mxEvent.isControlDown(evt))
  );
};

/**
 *
 */
HoverIcons.prototype.createArrow = function(img, tooltip) {
  let arrow: any = null;

  if (mxClient.IS_IE && !mxClient.IS_SVG) {
    // Workaround for PNG images in IE6
    if (mxClient.IS_IE6 && document.compatMode !== 'CSS1Compat') {
      arrow = document.createElement(mxClient.VML_PREFIX + ':image');
      arrow.setAttribute('src', img.src);
      arrow.style.borderStyle = 'none';
    } else {
      arrow = document.createElement('div');
      arrow.style.backgroundImage = 'url(' + img.src + ')';
      arrow.style.backgroundPosition = 'center';
      arrow.style.backgroundRepeat = 'no-repeat';
    }

    arrow.style.width = img.width + 4 + 'px';
    arrow.style.height = img.height + 4 + 'px';
    arrow.style.display = mxClient.IS_QUIRKS ? 'inline' : 'inline-block';
  } else {
    arrow = mxUtils.createImage(img.src);
    arrow.style.width = img.width + 'px';
    arrow.style.height = img.height + 'px';
    arrow.style.padding = this.tolerance + 'px';
  }

  if (tooltip != null) {
    arrow.setAttribute('title', tooltip);
  }

  arrow.style.position = 'absolute';
  arrow.style.cursor = this.cssCursor;

  mxEvent.addGestureListeners(
    arrow,
    mxUtils.bind(this, function(evt) {
      if (this.currentState != null && !this.isResetEvent(evt)) {
        this.mouseDownPoint = mxUtils.convertPoint(
          this.graph.container,
          mxEvent.getClientX(evt),
          mxEvent.getClientY(evt)
        );
        this.drag(evt, this.mouseDownPoint.x, this.mouseDownPoint.y);
        this.activeArrow = arrow;
        this.setDisplay('none');
        mxEvent.consume(evt);
      }
    })
  );

  // Captures mouse events as events on graph
  mxEvent.redirectMouseEvents(arrow, this.graph, this.currentState);

  mxEvent.addListener(
    arrow,
    'mouseenter',
    mxUtils.bind(this, function(evt) {
      // Workaround for Firefox firing mouseenter on touchend
      if (mxEvent.isMouseEvent(evt)) {
        if (this.activeArrow != null && this.activeArrow !== arrow) {
          mxUtils.setOpacity(this.activeArrow, this.inactiveOpacity);
        }

        this.graph.connectionHandler.constraintHandler.reset();
        mxUtils.setOpacity(arrow, 100);
        this.activeArrow = arrow;
      }
    })
  );

  mxEvent.addListener(
    arrow,
    'mouseleave',
    mxUtils.bind(this, function(evt) {
      // Workaround for IE11 firing this event on touch
      if (!this.graph.isMouseDown) {
        this.resetActiveArrow();
      }
    })
  );

  return arrow;
};

/**
 *
 */
HoverIcons.prototype.resetActiveArrow = function() {
  if (this.activeArrow != null) {
    mxUtils.setOpacity(this.activeArrow, this.inactiveOpacity);
    this.activeArrow = null;
  }
};

/**
 *
 */
HoverIcons.prototype.getDirection = function() {
  let dir = mxConstants.DIRECTION_EAST;

  if (this.activeArrow === this.arrowUp) {
    dir = mxConstants.DIRECTION_NORTH;
  } else if (this.activeArrow === this.arrowDown) {
    dir = mxConstants.DIRECTION_SOUTH;
  } else if (this.activeArrow === this.arrowLeft) {
    dir = mxConstants.DIRECTION_WEST;
  }

  return dir;
};

/**
 *
 */
HoverIcons.prototype.visitNodes = function(visitor) {
  for (let i = 0; i < this.elts.length; i++) {
    if (this.elts[i] != null) {
      visitor(this.elts[i]);
    }
  }
};

/**
 *
 */
HoverIcons.prototype.removeNodes = function() {
  this.visitNodes(function(elt) {
    if (elt.parentNode != null) {
      elt.parentNode.removeChild(elt);
    }
  });
};

/**
 *
 */
HoverIcons.prototype.setDisplay = function(display) {
  this.visitNodes(function(elt) {
    elt.style.display = display;
  });
};

/**
 *
 */
HoverIcons.prototype.isActive = function() {
  return this.activeArrow != null && this.currentState != null;
};

/**
 *
 */
HoverIcons.prototype.drag = function(evt, x, y) {
  this.graph.popupMenuHandler.hideMenu();
  this.graph.stopEditing(false);

  // Checks if state was removed in call to stopEditing above
  if (this.currentState != null) {
    this.graph.connectionHandler.start(this.currentState, x, y);
    this.graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
    this.graph.isMouseDown = true;

    // Hides handles for selection cell
    const handler = this.graph.selectionCellsHandler.getHandler(
      this.currentState.cell
    );

    if (handler != null) {
      handler.setHandlesVisible(false);
    }

    // Ctrl+shift drag sets source constraint
    const es = this.graph.connectionHandler.edgeState;

    if (
      evt != null &&
      mxEvent.isShiftDown(evt) &&
      mxEvent.isControlDown(evt) &&
      es != null &&
      mxUtils.getValue(es.style, mxConstants.STYLE_EDGE, null) ===
        'orthogonalEdgeStyle'
    ) {
      const direction = this.getDirection();
      es.cell.style = mxUtils.setStyle(
        es.cell.style,
        'sourcePortConstraint',
        direction
      );
      es.style['sourcePortConstraint'] = direction;
    }
  }
};

/**
 *
 */
HoverIcons.prototype.getStateAt = function(state, x, y) {
  return this.graph.view.getState(this.graph.getCellAt(x, y));
};

/**
 *
 */
HoverIcons.prototype.click = function(state, dir, me) {
  const evt = me.getEvent();
  const x = me.getGraphX();
  const y = me.getGraphY();

  const tmp = this.getStateAt(state, x, y);

  if (
    tmp != null &&
    this.graph.model.isEdge(tmp.cell) &&
    !mxEvent.isControlDown(evt) &&
    (tmp.getVisibleTerminalState(true) === state ||
      tmp.getVisibleTerminalState(false) === state)
  ) {
    this.graph.setSelectionCell(tmp.cell);
    this.reset();
  } else if (state != null) {
    this.clickHandler(state.cell, dir, evt);
  }

  me.consume();
};

/**
 *
 */
HoverIcons.prototype.reset = function(clearTimeout) {
  clearTimeout = clearTimeout == null ? true : clearTimeout;

  if (clearTimeout && this.updateThread != null) {
    window.clearTimeout(this.updateThread);
  }

  this.mouseDownPoint = null;
  this.currentState = null;
  this.activeArrow = null;
  this.removeNodes();
  this.bbox = null;
};

/**
 *
 */
HoverIcons.prototype.repaint = function() {
  this.bbox = null;

  if (this.currentState != null) {
    // Checks if cell was deleted
    this.currentState = this.getState(this.currentState);

    // Cell was deleted
    if (
      this.currentState != null &&
      this.graph.model.isVertex(this.currentState.cell) &&
      this.graph.isCellConnectable(this.currentState.cell)
    ) {
      let bds = mxRectangle.fromRectangle(this.currentState);

      // Uses outer bounding box to take rotation into account
      if (
        this.currentState.shape != null &&
        this.currentState.shape.boundingBox != null
      ) {
        bds = mxRectangle.fromRectangle(this.currentState.shape.boundingBox);
      }

      bds.grow(this.graph.tolerance);
      bds.grow(this.arrowSpacing);

      const handler = this.graph.selectionCellsHandler.getHandler(
        this.currentState.cell
      );
      let rotationBbox: any = null;

      if (handler != null) {
        bds.x -= handler.horizontalOffset / 2;
        bds.y -= handler.verticalOffset / 2;
        bds.width += handler.horizontalOffset;
        bds.height += handler.verticalOffset;

        // Adds bounding box of rotation handle to avoid overlap
        if (
          handler.rotationShape != null &&
          handler.rotationShape.node != null &&
          handler.rotationShape.node.style.visibility !== 'hidden' &&
          handler.rotationShape.node.style.display !== 'none' &&
          handler.rotationShape.boundingBox != null
        ) {
          rotationBbox = handler.rotationShape.boundingBox;
        }
      }

      // Positions arrows avoid collisions with rotation handle
      const positionArrow = mxUtils.bind(this, function(arrow, x, y) {
        if (rotationBbox != null) {
          const bbox = new mxRectangle(
            x,
            y,
            arrow.clientWidth,
            arrow.clientHeight
          );

          if (mxUtils.intersects(bbox, rotationBbox)) {
            if (arrow === this.arrowUp) {
              y -= bbox.y + bbox.height - rotationBbox.y;
            } else if (arrow === this.arrowRight) {
              x += rotationBbox.x + rotationBbox.width - bbox.x;
            } else if (arrow === this.arrowDown) {
              y += rotationBbox.y + rotationBbox.height - bbox.y;
            } else if (arrow === this.arrowLeft) {
              x -= bbox.x + bbox.width - rotationBbox.x;
            }
          }
        }

        arrow.style.left = x + 'px';
        arrow.style.top = y + 'px';
        mxUtils.setOpacity(arrow, this.inactiveOpacity);
      });

      positionArrow(
        this.arrowUp,
        Math.round(
          this.currentState.getCenterX() -
            this.triangleUp.width / 2 -
            this.tolerance
        ),
        Math.round(bds.y - this.triangleUp.height - this.tolerance)
      );

      positionArrow(
        this.arrowRight,
        Math.round(bds.x + bds.width - this.tolerance),
        Math.round(
          this.currentState.getCenterY() -
            this.triangleRight.height / 2 -
            this.tolerance
        )
      );

      positionArrow(
        this.arrowDown,
        parseInt(this.arrowUp.style.left),
        Math.round(bds.y + bds.height - this.tolerance)
      );

      positionArrow(
        this.arrowLeft,
        Math.round(bds.x - this.triangleLeft.width - this.tolerance),
        parseInt(this.arrowRight.style.top)
      );

      if (this.checkCollisions) {
        let right = this.graph.getCellAt(
          bds.x + bds.width + this.triangleRight.width / 2,
          this.currentState.getCenterY()
        );
        let left = this.graph.getCellAt(
          bds.x - this.triangleLeft.width / 2,
          this.currentState.getCenterY()
        );
        let top = this.graph.getCellAt(
          this.currentState.getCenterX(),
          bds.y - this.triangleUp.height / 2
        );
        let bottom = this.graph.getCellAt(
          this.currentState.getCenterX(),
          bds.y + bds.height + this.triangleDown.height / 2
        );

        // Shows hover icons large cell is behind all directions of current cell
        if (right != null && right === left && left === top && top === bottom) {
          right = null;
          left = null;
          top = null;
          bottom = null;
        }

        const currentGeo = this.graph.getCellGeometry(this.currentState.cell);

        const checkCollision = mxUtils.bind(this, function(cell, arrow) {
          const geo =
            this.graph.model.isVertex(cell) && this.graph.getCellGeometry(cell);

          // Ignores collision if vertex is more than 3 times the size of this vertex
          if (
            cell != null &&
            !this.graph.model.isAncestor(cell, this.currentState.cell) &&
            !this.graph.isSwimlane(cell) &&
            (geo == null ||
              currentGeo == null ||
              (geo.height < 3 * currentGeo.height &&
                geo.width < 3 * currentGeo.width))
          ) {
            arrow.style.visibility = 'hidden';
          } else {
            arrow.style.visibility = 'visible';
          }
        });

        checkCollision(right, this.arrowRight);
        checkCollision(left, this.arrowLeft);
        checkCollision(top, this.arrowUp);
        checkCollision(bottom, this.arrowDown);
      } else {
        this.arrowLeft.style.visibility = 'visible';
        this.arrowRight.style.visibility = 'visible';
        this.arrowUp.style.visibility = 'visible';
        this.arrowDown.style.visibility = 'visible';
      }

      if (this.graph.tooltipHandler.isEnabled()) {
        this.arrowLeft.setAttribute('title', mxResources.get('plusTooltip'));
        this.arrowRight.setAttribute('title', mxResources.get('plusTooltip'));
        this.arrowUp.setAttribute('title', mxResources.get('plusTooltip'));
        this.arrowDown.setAttribute('title', mxResources.get('plusTooltip'));
      } else {
        this.arrowLeft.removeAttribute('title');
        this.arrowRight.removeAttribute('title');
        this.arrowUp.removeAttribute('title');
        this.arrowDown.removeAttribute('title');
      }
    } else {
      this.reset();
    }

    // Updates bounding box
    if (this.currentState != null) {
      this.bbox = this.computeBoundingBox();

      // Adds tolerance for hover
      if (this.bbox != null) {
        this.bbox.grow(10);
      }
    }
  }
};

/**
 *
 */
HoverIcons.prototype.computeBoundingBox = function() {
  let bbox = !this.graph.model.isEdge(this.currentState.cell)
    ? mxRectangle.fromRectangle(this.currentState)
    : null;

  this.visitNodes(function(elt) {
    if (elt.parentNode != null) {
      const tmp = new mxRectangle(
        elt.offsetLeft,
        elt.offsetTop,
        elt.offsetWidth,
        elt.offsetHeight
      );

      if (bbox == null) {
        bbox = tmp;
      } else {
        bbox.add(tmp);
      }
    }
  });

  return bbox;
};

/**
 *
 */
HoverIcons.prototype.getState = function(state) {
  if (state != null) {
    let cell = state.cell;

    if (!this.graph.getModel().contains(cell)) {
      state = null;
    } else {
      // Uses connectable parent vertex if child is not connectable
      if (
        this.graph.getModel().isVertex(cell) &&
        !this.graph.isCellConnectable(cell)
      ) {
        const parent = this.graph.getModel().getParent(cell);

        if (
          this.graph.getModel().isVertex(parent) &&
          this.graph.isCellConnectable(parent)
        ) {
          cell = parent;
        }
      }

      // Ignores locked cells and edges
      if (this.graph.isCellLocked(cell) || this.graph.model.isEdge(cell)) {
        cell = null;
      }

      state = this.graph.view.getState(cell);

      if (state != null && state.style == null) {
        state = null;
      }
    }
  }

  return state;
};

/**
 *
 */
HoverIcons.prototype.update = function(state, x, y) {
  if (
    state != null &&
    mxUtils.getValue(state.style, 'allowArrows', '1') === '0'
  ) {
    this.reset();
  } else {
    if (
      state != null &&
      state.cell.geometry != null &&
      state.cell.geometry.relative &&
      this.graph.model.isEdge(state.cell.parent)
    ) {
      state = null;
    }

    let timeOnTarget: any = null;

    // Time on target
    if (this.prev !== state || this.isActive()) {
      this.startTime = new Date().getTime();
      this.prev = state;
      timeOnTarget = 0;

      if (this.updateThread != null) {
        window.clearTimeout(this.updateThread);
      }

      if (state != null) {
        // Starts timer to update current state with no mouse events
        this.updateThread = window.setTimeout(
          mxUtils.bind(this, function() {
            if (
              !this.isActive() &&
              !this.graph.isMouseDown &&
              !this.graph.panningHandler.isActive()
            ) {
              this.prev = state;
              this.update(state, x, y);
            }
          }),
          this.updateDelay + 10
        );
      }
    } else if (this.startTime != null) {
      timeOnTarget = new Date().getTime() - this.startTime;
    }

    this.setDisplay('');

    if (
      this.currentState != null &&
      this.currentState !== state &&
      timeOnTarget < this.activationDelay &&
      this.bbox != null &&
      !mxUtils.contains(this.bbox, x, y)
    ) {
      this.reset(false);
    } else if (
      this.currentState != null ||
      timeOnTarget > this.activationDelay
    ) {
      if (
        this.currentState !== state &&
        ((timeOnTarget > this.updateDelay && state != null) ||
          this.bbox == null ||
          x == null ||
          y == null ||
          !mxUtils.contains(this.bbox, x, y))
      ) {
        if (state != null && this.graph.isEnabled()) {
          this.removeNodes();
          this.setCurrentState(state);
          this.repaint();

          // Resets connection points on other focused cells
          if (
            this.graph.connectionHandler.constraintHandler.currentFocus !==
            state
          ) {
            this.graph.connectionHandler.constraintHandler.reset();
          }
        } else {
          this.reset();
        }
      }
    }
  }
};

/**
 *
 */
HoverIcons.prototype.setCurrentState = function(state) {
  if (state.style['portConstraint'] !== 'eastwest') {
    this.graph.container.appendChild(this.arrowUp);
    this.graph.container.appendChild(this.arrowDown);
  }

  this.graph.container.appendChild(this.arrowRight);
  this.graph.container.appendChild(this.arrowLeft);
  this.currentState = state;
};

export default HoverIcons;

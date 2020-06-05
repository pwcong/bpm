import React from 'react'

import classnames from 'classnames'

import EditorUI from './components/editorui'
import Menubar, {
  data as menubarData,
  map as menubarMap
} from './components/menubar'
import Toolbar, {
  data as toolbarData,
  map as toolbarMap
} from './components/toolbar'
import Sidebar from './components/sidebar'

import svgArrowT0 from '@@/static/mxgraph/images/arrow-t-0.svg'
import svgArrowT1 from '@@/static/mxgraph/images/arrow-t-1.svg'
import svgArrowR0 from '@@/static/mxgraph/images/arrow-r-0.svg'
import svgArrowR1 from '@@/static/mxgraph/images/arrow-r-1.svg'

import {
  IBaseProps,
  IConfig,
  IWrappedComponentRef,
  IWrappedComponentRefObject
} from './types'

import { debounce } from './utils'

export * from './utils'
export * from './types'

import './style.scss'

export interface IProps extends IBaseProps {
  isIFrame?: boolean
  isMobile?: boolean
  config?: IConfig
  onSelectCells?: (editorUI: EditorUI, cells: Array<any>, event) => void
  wrappedComponentRef?: (ref: IWrappedComponentRefObject) => void
}

const cls = 'bpm-flowchart'

export const Chart: React.FunctionComponent<IProps> = props => {
  const {
    isMobile,
    className,
    style,
    wrappedComponentRef,
    config = {}
  } = props

  const ref = React.useRef<HTMLDivElement | null>(null)
  const propsRef = React.useRef<IProps>(props)

  const [editorUI, setEditorUI] = React.useState<EditorUI>()

  const componentRef = React.useRef<IWrappedComponentRef>({})

  React.useEffect(() => {
    const container = ref.current

    if (!container) {
      return
    }

    const _editorUI = new EditorUI(container, {
      toolbar: {
        data: toolbarData,
        map: toolbarMap
      },
      menubar: {
        data: menubarData,
        map: menubarMap
      },
      ...config,
      onSelectCells: (_, sender, event) => {
        propsRef.current.onSelectCells && propsRef.current.onSelectCells(
          _editorUI, 
          [...(sender.cells || [])], 
          event
        )
      }
    })
    setEditorUI(_editorUI)

    return () => {
      // 元素被销毁后报错问题
      try {
        ref.current && _editorUI && _editorUI.destroy()
      } catch (e) {
        // DO NOTHING
      }
    }
  }, [])


  React.useEffect(() => {
    componentRef.current.editorUI = editorUI
    wrappedComponentRef && wrappedComponentRef(componentRef)

    window['flowchart'] = (window['flowchart'] || []).concat([editorUI])

    return () => {
      (window['flowchart'] || []).splice(
        (window['flowchart'] || []).indexOf(editorUI), 
        1
      )
    }
  }, [editorUI])

  React.useEffect(() => {
    propsRef.current = props
  }, [props])

  const _cls = `${cls}-chart`

  return (
    <div
      ref={ref}
      className={classnames(_cls, className, {
        [`${_cls}-readonly`]: config.editable === false,
        [`${_cls}-is-mobile`]: isMobile
      })}
      style={style}
    ></div>
  )
}

const FlowChart: React.FunctionComponent<IProps & {
  onToggleScreen?: (active: boolean) => void
  render?: {
    leftPanel?: (cells: Array<any>, editorUI: EditorUI | null) => React.ReactNode
    rightPanel?: (cells: Array<any>, editorUI: EditorUI | null) => React.ReactNode
  }
}> = props => {
  const {
    className,
    style,
    onToggleScreen,
    wrappedComponentRef,
    config = {},
    render = {},
    isIFrame,
    isMobile,
  } = props

  const [editorUI, setEditorUi] = React.useState<EditorUI | null>(null)
  const [selectedCells, setSelectedCells] = React.useState<Array<any>>([])
  const [topHidden, setTopHidden] = React.useState<boolean>(false)
  const [leftHidden, setLeftHidden] = React.useState<boolean>(false)
  const [rightHidden, setRightHidden] = React.useState<boolean>(false)

  const redraw = React.useCallback(() => editorUI && editorUI.redraw(300), [
    editorUI
  ])
  const onSelectCells = React.useCallback((editorUI: EditorUI, cells: Array<any>) => {
    setTimeout(() => {
      setSelectedCells(cells)
    })
  }, [])

  React.useEffect(() => {
    const resize = debounce(() => {
      // // pc端iframe嵌入不允许重新绘制
      // if (isIFrame && !isMobile) {
      //   return
      // }
      redraw()
    }, 100)
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [editorUI, isIFrame, isMobile])

  React.useEffect(() => {
    onToggleScreen && onToggleScreen(topHidden)
  }, [topHidden])

  return (
    <div
      className={classnames(cls, className, {
        [`${cls}-hide-top`]: topHidden,
        [`${cls}-hide-right`]: rightHidden,
        [`${cls}-no-right`]: !render.rightPanel,
        [`${cls}-hide-left`]: leftHidden,
        [`${cls}-no-left`]: !render.leftPanel,
        [`${cls}-readonly`]: config.editable === false
      })}
      style={style}
    >
      {editorUI && (
        <div className={`${cls}-t`}>
          <div className={`${cls}-t-t`}>
            <div className={`${cls}-t-t-l`}>
              <Menubar
                data={config.menubar ? config.menubar.data : menubarData}
                editorUI={editorUI}
              />
            </div>
            <div className={`${cls}-t-t-s`}></div>
            <div className={`${cls}-t-t-r`}>
              <Toolbar
                data={config.toolbar ? config.toolbar.data : toolbarData}
                editorUI={editorUI}
              />
            </div>
          </div>
          <div className={`${cls}-t-b`}>
            <div
              className={`${cls}-toggler`}
              onClick={() => {
                setTopHidden(!topHidden)
                redraw()
              }}
              style={{
                backgroundImage: `url(${topHidden ? svgArrowT0 : svgArrowT1})`
              }}
            ></div>
          </div>
        </div>
      )}
      <div className={`${cls}-b`}>
        {
          render.leftPanel && editorUI && (
            <div className={`${cls}-b-l`}>
              <div className={`${cls}-b-l-l`}>
                {render.leftPanel && render.leftPanel(selectedCells, editorUI)}
              </div>
              <div className={`${cls}-b-l-r`}>
                <div
                  className={`${cls}-toggler`}
                  onClick={() => {
                    setLeftHidden(!leftHidden)
                    redraw()
                  }}
                  style={{
                    backgroundImage: `url(${leftHidden ? svgArrowR0 : svgArrowR1})`
                  }}
                ></div>
              </div>
            </div>
          )
        }
        <div className={`${cls}-b-m`}>
          <Chart
            config={config}
            onSelectCells={onSelectCells}
            wrappedComponentRef={ref => {
              ref &&
                ref.current &&
                ref.current.editorUI &&
                setEditorUi(ref.current.editorUI)
              wrappedComponentRef && wrappedComponentRef(ref)
            }}
          />
        </div>
        
        {
          render.rightPanel && editorUI && (            
            <div className={`${cls}-b-r`}>
              <div className={`${cls}-b-r-l`}>
                <div
                  className={`${cls}-toggler`}
                  onClick={() => {
                    setRightHidden(!rightHidden)
                    redraw()
                  }}
                  style={{
                    backgroundImage: `url(${rightHidden ? svgArrowR0 : svgArrowR1})`
                  }}
                ></div>
              </div>
              <div className={`${cls}-b-r-r`}>
                {render.rightPanel && render.rightPanel(selectedCells, editorUI)}
              </div>
            </div>
          )
        }

        <div className={`${cls}-b-b`}>
          {editorUI && (
            <Sidebar
              editorUI={editorUI}
              fullscreen={topHidden && rightHidden}
              onToggleScreen={active => {
                setTopHidden(active)
                setRightHidden(active)
                redraw()
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default FlowChart

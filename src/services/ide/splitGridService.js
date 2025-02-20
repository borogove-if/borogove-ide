/**
 * This is copied from https://github.com/nathancahill/split/blob/master/packages/react-split-grid/src/index.js
 * The original version's (1.0.4) Typescript definitions are broken.
 * This is otherwise identical but it has the prop-types definitions removed.
 */

import React from "react";
import Split from "split-grid";

class ReactSplitGrid extends React.Component {
    constructor(props) {
        super(props);

        this.columnGutters = {};
        this.rowGutters = {};

        this.state = {
            gridTemplateColumns: props.gridTemplateColumns
                ? props.gridTemplateColumns
                : null,
            gridTemplateRows: props.gridTemplateRows
                ? props.gridTemplateRows
                : null
        };

        this.getGridProps = this.getGridProps.bind(this);
        this.getGutterProps = this.getGutterProps.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.writeStyle = this.writeStyle.bind(this);
        this.onDrag = this.onDrag.bind(this);
    }

    componentDidMount() {
        const { children, ...options } = this.props;

        options.writeStyle = this.writeStyle;
        options.onDrag = this.onDrag;

        this.split = Split(options);
    }

    componentDidUpdate(prevProps) {
        const {
            columnMinSizes,
            rowMinSizes,
            columnMaxSizes,
            rowMaxSizes,
            children,
            ...options
        } = this.props;

        const {
            columnMinSizes: prevColumnMinSizes,
            rowMinSizes: prevRowMinSizes,
            columnMaxSizes: prevColumnMaxSizes,
            rowMaxSizes: prevRowMaxSizes
        } = prevProps;

        const otherProps = [
            "minSize",
            "maxSize",
            "columnMinSize",
            "rowMinSize",
            "columnMaxSize",
            "rowMaxSize",
            "columnMinSizes",
            "rowMinSizes",
            "columnMaxSizes",
            "rowMaxSizes",
            "snapOffset",
            "columnSnapOffset",
            "rowSnapOffset",
            "dragInterval",
            "columnDragInterval",
            "rowDragInterval",
            "cursor",
            "columnCursor",
            "rowCursor"
        ];

        let needsRecreate = otherProps
            .map(prop => this.props[prop] !== prevProps[prop])
            .reduce((accum, same) => accum || same, false);

        // TODO use deep equals
        if (columnMinSizes !== prevColumnMinSizes) {
            needsRecreate = true;
        }

        if (rowMinSizes !== prevRowMinSizes) {
            needsRecreate = true;
        }

        if (rowMaxSizes !== prevRowMaxSizes) {
            needsRecreate = true;
        }

        // Destroy and re-create split if options changed
        if (needsRecreate) {
            options.columnMinSizes = columnMinSizes;
            options.rowMinSizes = rowMinSizes;

            this.split.destroy(false);

            this.split = Split(options);
        }
    }

    componentWillUnmount() {
        this.split.destroy();
        delete this.split;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const state = {};
        let needsSetState = false;

        if (
            nextProps.gridTemplateColumns &&
            nextProps.gridTemplateColumns !== prevState.gridTemplateColumns
        ) {
            state.gridTemplateColumns = nextProps.gridTemplateColumns;
            needsSetState = true;
        }

        if (
            nextProps.gridTemplateRows &&
            nextProps.gridTemplateRows !== prevState.prevGridTemplateRows
        ) {
            state.gridTemplateRows = nextProps.gridTemplateRows;
            needsSetState = true;
        }

        if (needsSetState) {
            return state;
        }

        return null;
    }

    onDrag(direction, track, style) {
        const { onDrag } = this.props;

        if (onDrag) {
            onDrag(direction, track, style);
        }
    }

    getGridProps() {
        const { gridTemplateColumns, gridTemplateRows } = this.state;
        const style = {};

        if (gridTemplateColumns) {
            style.gridTemplateColumns = gridTemplateColumns;
        }

        if (gridTemplateRows) {
            style.gridTemplateRows = gridTemplateRows;
        }

        return {
            style
        };
    }

    getGutterProps(direction, track) {
        return {
            onMouseDown: this.handleDragStart(direction, track),
            onTouchStart: this.handleDragStart(direction, track)
        };
    }

    handleDragStart(direction, track) {
        return e => {
            this.split.handleDragStart(e, direction, track);
        };
    }

    writeStyle(element, gridTemplateProp, style) {
        const state = {};

        if (gridTemplateProp === "grid-template-columns") {
            state.gridTemplateColumns = style;
        } else if (gridTemplateProp === "grid-template-rows") {
            state.gridTemplateRows = style;
        }

        this.setState(state);
    }

    render() {
        const { component, render, children } = this.props;
        const props = {
            getGridProps: this.getGridProps,
            getGutterProps: this.getGutterProps
        };

        return component
            ? React.createElement(component, props)
            : render
              ? render(props)
              : children
                ? typeof children === "function"
                    ? children(props)
                    : !(React.Children.count(children) === 0)
                      ? React.Children.only(children)
                      : null
                : null;
    }
}

ReactSplitGrid.defaultProps = {
    component: undefined,
    render: undefined,
    children: undefined,
    gridTemplateColumns: undefined,
    gridTemplateRows: undefined,
    columnMinSizes: undefined,
    rowMinSizes: undefined,
    columnMaxSizes: undefined,
    rowMaxSizes: undefined,
    onDrag: undefined
};

export default ReactSplitGrid;

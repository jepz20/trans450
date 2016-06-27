import React from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';
import {compose} from 'redux';

const Note = ({
	connectDragSource, connectDragTarget,
	isDragging, isOver, onMove, id, editing,
	children, ...props
}) => {
	const dragSource = editing ? a => a : connectDragSource;
	return compose(dragSource, connectDragTarget)(
		<div style={{
			opacity: isDragging || isOver ? 0 : 1
		}}{...props}>
			{children}
		</div>
	);
};

const noteSource = {
	beginDrag(props) {
		return {
			id: props.id
		};
	}
};

const noteTarget = {
	hover(targetProps, monitor) {
		const targetId = targetProps.id;
		const sourceProps = monitor.getItem();
		const sourceId = sourceProps.id;

		if(sourceId !== targetId) {
			targetProps.onMove({sourceId, targetId});
		}
	}
};

export default compose(
	DragSource(ItemTypes.NOTE, noteSource, (connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	})),
	DropTarget(ItemTypes.NOTE, noteTarget, (connect, monitor) => ({
		connectDragTarget: connect.dropTarget(),
		isOver: monitor.isOver()
	}))
)(Note)
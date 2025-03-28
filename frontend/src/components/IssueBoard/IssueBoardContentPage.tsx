import React, {useState} from 'react';
import {closestCenter, DndContext, DragEndEvent} from '@dnd-kit/core';
import {arrayMove, horizontalListSortingStrategy, SortableContext, useSortable,} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Card} from 'antd';

interface Column {
    id: string;
    title: string;
}

const initialColumns: Column[] = [
    {id: 'column-1', title: 'To Do'},
    {id: 'column-2', title: 'In Progress'},
    {id: 'column-3', title: 'Done'},
];

interface SortableColumnProps {
    id: string;
    title: string;
}

const SortableColumn: React.FC<SortableColumnProps> = ({id, title}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id});

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '8px',
        margin: '8px',
        backgroundColor: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: '4px',
        width: '300px',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <h3>{title}</h3>
            {/* You can add a list of issues or cards here */}
            <Card style={{marginTop: '8px'}}>
                {/* Example card content */}
                Issue details here...
            </Card>
        </div>
    );
};

const IssueBoardContentPage: React.FC = () => {
    const [columns, setColumns] = useState(initialColumns);

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (over && active.id !== over.id) {
            setColumns((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <div style={{height: 'calc(100% - 50px)'}}>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={columns.map((col) => col.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    <div style={{display: 'flex', overflowX: 'auto'}}>
                        {columns.map((column) => (
                            <SortableColumn key={column.id} id={column.id} title={column.title}/>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default IssueBoardContentPage;
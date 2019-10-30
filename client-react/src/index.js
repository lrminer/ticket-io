import React from "react";
import ReactDOM from "react-dom";
import "@atlaskit/css-reset";
import Column from "./column";
import initialData from "./initial-data";
import styled from "styled-components";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  state = initialData;

  onDragStart = start => {
    // document.body.style.color = "orange";
    // document.body.style.transition = "background-color 0.2s ease";
    const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);

    this.setState({ homeIndex });
  };

  onDragUpdate = update => {
    const { destination } = update;
    const opacity = destination
      ? destination.index / Object.keys(this.state.tasks).length
      : 0;
    document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity}`;
  };

  onDragEnd = result => {
    this.setState({ homeIndex: null });

    // document.body.style.color = "inherit";
    // document.body.style.backgroundColor = "inherit";

    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const newColumnOrder = Array.from(this.state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...this.state,
        columnOrder: newColumnOrder
      };

      this.setState(newState);
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    //moving within the same list
    if (start === finish) {
      const column = this.state.columns[source.droppableId];
      const newTaskIds = Array.from(column.taskIds);

      newTaskIds.splice(source.index, 1); // from this index we want to remove 1 item

      newTaskIds.splice(destination.index, 0, draggableId); // we want to remove nothing and index the new item

      const newColumn = {
        ...column,
        taskIds: newTaskIds
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      };

      this.setState(newState);
      return;
    }

    //migrating a todo to a different list
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };

    this.setState(newState);
  };

  render() {
    return (
      <DragDropContext
        // has three callbacks
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}
        onDragEnd={this.onDragEnd} // only required callback
      >
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {provided => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {this.state.columnOrder.map((columnId, index) => {
                const column = this.state.columns[columnId];
                const tasks = column.taskIds.map(
                  taskId => this.state.tasks[taskId]
                );
                const isDropDisabled = index < this.state.homeIndex;

                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    index={index}
                    isDropDisabled={isDropDisabled}
                  />
                );
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

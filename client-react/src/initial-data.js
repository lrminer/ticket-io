const initialData = {
  tasks: {
    "task-1": {
      id: "task-1",
      content: "call the doctors office"
    },
    "task-2": {
      id: "task-2",
      content: "walk the dog"
    },
    "task-3": {
      id: "task-3",
      content: "do the dishes"
    },
    "task-4": {
      id: "task-4",
      content: "take out the garbage"
    }
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do",
      taskIds: ["task-1", "task-2", "task-3", "task-4"]
    },
    "column-2": {
      id: "column-2",
      title: "Work In Progress",
      taskIds: []
    }
  },
  columnOrder: ["column-1", "column-2"]
};

export default initialData;

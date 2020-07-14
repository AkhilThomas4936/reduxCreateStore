//Library code
function createStore(reducer) {
  //The store should have these four parts
  //1.The state
  //2.Get the state
  //3.Listen to changes on the state
  //4.Update the state

  let state;
  let listeners = [];
  const getState = () => state;
  const subscribe = (listner) => {
    listeners.push(listner);
    return () => {
      listeners = listeners.filter((l) => l !== listner);
    };
  };

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listner) => listner());
  };

  return {
    getState,
    subscribe,
    dispatch,
  };
}

/*we created a function called createStore() that returns a store object.

createStore() must be passed a "reducer" function when invoked.

the store object has three methods on it:

.getState() - used to get the current state from the store
.subscribe() - used to provide a listener function the store will call when the state changes
.dispatch() - used to make changes to the store's state*/

//App code

const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";

//Action creators for all the actions

function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}

//todos reducer

function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id);
    case TOGGLE_TODO:
      /*Our todos function needs to be a pure function.So we can't change the 'complete' 
property directly.So we do like this */

      return state.map((todo) =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      );

    default:
      return state;
  }
}

//goals reducer

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);
    default:
      return state;
  }
}
/* Right now we have two reducers
.todos and 
.goals

The createStore function can take only a single reducer.
So we pass a rootReducer */

function rootReducer(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action),
  };
}

//Creating the store

const store = createStore(rootReducer);

store.subscribe(() => {
  console.log("The new state is: ", store.getState());
});

store.dispatch(
  addTodoAction({
    id: 0,
    name: "Walk the dog",
    complete: false,
  })
);

store.dispatch(
  addTodoAction({
    id: 1,
    name: "Wash the car",
    complete: false,
  })
);

store.dispatch(
  addTodoAction({
    id: 2,
    name: "Go to the gym",
    complete: true,
  })
);

store.dispatch(removeTodoAction(1));

store.dispatch(toggleTodoAction(0));

store.dispatch({
  type: ADD_GOAL,
  goal: {
    id: 0,
    name: "Learn Redux",
  },
});
store.dispatch(
  addGoalAction({
    id: 1,
    name: "Lose 20 pounds",
  })
);

store.dispatch(removeGoalAction(0));

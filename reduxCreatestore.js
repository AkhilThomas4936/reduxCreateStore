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

//App code

function todos(state = [], action) {
  if (action.type === "ADD_TODO") {
    return state.concat([action.todo]);
  }
  return state;
}

const store = createStore(todos);
store.subscribe(() => {
  console.log("The new state is: ", store.getState());
});

store.subscribe(() => {
  console.log("The store has changed");
});

import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store, MutationTree, ActionTree , GetterTree } from 'vuex';

//export interface State { createPoll: { lat: number ; long: number; imageBefore: any; imageAfter: any; answers: []; time: number }; client: {} }
export interface State { poll: {}; client: {} }

export const key: InjectionKey<Store<State>> = Symbol();
const state: State = {
  //createPoll: { lat: 0 , long: 0 , imageBefore: null , imageAfter: null, answers: [] , time: 0},
  poll: {},
  client: {}
};

//GETTERS
const getters: GetterTree <State, any> = {
  /* ['GET_IMAGE_BEFORE'](state){
    return state.createPoll.imageBefore;
  },
  ['GET_IMAGE_AFTER'](state){
    return state.createPoll.imageAfter;
  },
  ['GET_ANSWERS'](state){
      return state.createPoll.answers;
  },
  ['GET_LAT'](state){
    return state.createPoll.lat;
  },
  ['GET_LONG'](state){
    return state.createPoll.long;
  },
  ['GET_TIME'](state){
    return state.createPoll.time;
  }, */
  ['GET_CLIENT'](state){
    return state.client;
  },
  ['GET_POLL'](state){
    return state.poll;
  }
}

//MUATATIONS
export const enum MUTATIONS {
    SET_IMAGE_BEFORE = 'SET_IMAGE_BEFORE',
    SET_IMAGE_AFTER = 'SET_IMAGE_AFTER',
    SET_ANSWERS = 'SET_ANSWERS',
    SET_LAT = 'SET_LAT',
    SET_LONG = 'SET_LONG',
    SET_TIME = 'SET_TIME',
    SET_CLIENT = 'SET_CLIENT',
    SET_POLL = 'SET_POLL'
}

const mutations: MutationTree<State> = {
  /* [MUTATIONS.SET_IMAGE_BEFORE](state, data){
    state.createPoll.imageBefore = data
  },
  [MUTATIONS.SET_IMAGE_AFTER](state, data){
    state.createPoll.imageAfter = data
  },
  [MUTATIONS.SET_ANSWERS](state , data){
      state.createPoll.answers = data
  },
  [MUTATIONS.SET_LAT](state , data){
      state.createPoll.lat = data
  },
  [MUTATIONS.SET_LONG](state , data){
      state.createPoll.long = data
  },
  [MUTATIONS.SET_TIME](state, data){
    state.createPoll.time = data
  }, */
  [MUTATIONS.SET_CLIENT](state,data){
    state.client = data
  },
  [MUTATIONS.SET_POLL](state,data){
    state.poll = data
  }
}

//ACTIONS
export const enum ACTIONS { 
  /* SET_IMAGE_BEFORE_ACTION = 'SET_IMAGE_BEFORE_ACTION',
  SET_IMAGE_AFTER_ACTION = 'SET_IMAGE_AFTER_ACTION',
  SET_ANSWERS_ACTION = 'SET_ANSWERS_ACTION',
  SET_LAT_ACTION = 'SET_LAT_ACTION',
  SET_LONG_ACTION = 'SET_LONG_ACTION',
  SET_TIME_ACTION = 'SET_TIME_ACTION', */
  SET_CLIENT_ACTION = 'SET_CLIENT_ACTION',
  SET_POLL_ACTION = 'SET_POLL_ACTION'
}

const actions: ActionTree<State, any> = {
  /* [ACTIONS.SET_IMAGE_BEFORE_ACTION](store, data) {
    store.commit(MUTATIONS.SET_IMAGE_BEFORE,data);
  },
  [ACTIONS.SET_IMAGE_AFTER_ACTION](store, data) {
    store.commit(MUTATIONS.SET_IMAGE_AFTER,data);
  },
  [ACTIONS.SET_ANSWERS_ACTION](store , data){
    store.commit(MUTATIONS.SET_ANSWERS, data)
  },
  [ACTIONS.SET_LAT_ACTION](store , data){
    store.commit(MUTATIONS.SET_LAT, data)
  },
  [ACTIONS.SET_LONG_ACTION](store , data){
    store.commit(MUTATIONS.SET_LONG, data)
  },
  [ACTIONS.SET_TIME_ACTION](store, data){
    store.commit(MUTATIONS.SET_TIME, data)
  }, */
  [ACTIONS.SET_CLIENT_ACTION](store, data){
    store.commit(MUTATIONS.SET_CLIENT, data)
  },
  [ACTIONS.SET_POLL_ACTION](store, data){
    store.commit(MUTATIONS.SET_POLL, data)
  }
};

export const store = createStore<State>({ state, mutations, actions , getters });

// our own `useStore` composition function for types
export function useStore() {
    return baseUseStore(key);
}
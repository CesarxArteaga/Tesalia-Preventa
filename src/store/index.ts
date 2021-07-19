import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store, MutationTree, ActionTree , GetterTree } from 'vuex';

export interface Poll { lat: string; lng: string; fileBefore: any; fileAfter: any; question: []; rows: [] }

export interface State { createPoll: Poll }

export const key: InjectionKey<Store<State>> = Symbol();
const state: State = {
  createPoll: { lat: '', lng: '', fileBefore: '', fileAfter: '', question: [], rows: [] }
};

//GETTERS
const getters: GetterTree <State, any> = {
    ['GET_POLS'](state){
        return state.createPoll.rows
    }
}

//MUATATIONS
export const enum MUTATIONS {
    SET_IMAGE_BEFORE = 'SET_IMAGE_BEFORE',
    SET_POLS = 'SET_POLS'
}

const mutations: MutationTree<State> = {
  [MUTATIONS.SET_IMAGE_BEFORE](state, data){
    state.createPoll.fileBefore = data
  },
  [MUTATIONS.SET_POLS](state , data){
      state.createPoll.rows = data
  }
}

//ACTIONS
export const enum ACTIONS { SET_IMAGE_BEFORE_ACTION = 'SET_IMAGE_BEFORE_ACTION' , SET_POLS_ACTION = 'SET_POLS_ACTION' }

const actions: ActionTree<State, any> = {
  [ACTIONS.SET_IMAGE_BEFORE_ACTION](store, data) {
    store.commit(MUTATIONS.SET_IMAGE_BEFORE,data);
  },
  [ACTIONS.SET_POLS_ACTION](store , data){
    store.commit(MUTATIONS.SET_POLS, data)
  }
};

export const store = createStore<State>({ state, mutations, actions , getters });

// our own `useStore` composition function for types
export function useStore() {
    return baseUseStore(key);
}
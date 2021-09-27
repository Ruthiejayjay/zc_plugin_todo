import axios from 'axios'
export default {
    namespaced: true,
    state: {
        isUser: null,
        todos: [],
        names: [],
        archive: [],
        trash: [],
        showAll: true,
        isComment: false,
        selectedTodo: null,
        isAssign: false,
        searchedTodo: [],
        errMessage: "No Result Found"

    },
    mutations: {
        ADD_TODOS(state, data) {
            state.todos.unshift(data)
        },
        IS_USER(state, data) {
            state.isUser = data
        },
        TOG_ASSIGN(state) {
            state.isAssign = !state.isAssign
        },
        SET_ARCHIVED(state, data) {
            state.archive = [...data]
        },
        ADD_ARCHIVE(state, data) {
            state.archive.push(data)
        },
        SET_TODOS(state, data) {
            state.todos = data
        },
        ADD_TRASH(state, data) {
            state.trash.push(data)
        },
        SELECTED_TODO(state, data) {
            state.selectedTodo = data
        },
        RESULT(state, data) {
            state.searchedTodo = data
        },
        TOGGLESHOW(state, data) {
            state.showAll = data
        }
    },
    getters: {
        allTodos(state) {
            return state.todos
        },
        allArchive(state) {
            return state.archive
        },
        user(state) {
            return state.isUser
        },
        allTrash(state) {
            return state.trash
        },
        isAssign(state) {
            return state.isAssign
        },
        searchedTodo(state) {
            return state.searchedTodo
        },
        showAll(state) {
            return state.showAll
        },
        organization(state) {
            return state.isUser.Organizations[0];
        }
    },
    actions: {
        async getAllTodos({ commit, state }) {
            console.log(state)
            const user_id = state.isUser._id;
            const org_id = state.isUser.Organizations[0];
            await axios.get(`user-todo?user_id=${user_id}&organisation_id=${org_id}`)
                .then(response => (commit('SET_TODOS', response.data.data)))
                .catch(error => console.log(error))
        },
        toggleAssign({ commit }) {
            console.log('heloo')
            commit('TOG_ASSIGN');

        },
        ADD_USER({ commit }, data) {
            commit('IS_USER', data)
        },
        async getAllArchivedTodos({ commit, state }) {
            const user_id = state.isUser._id;
            const org_id = state.isUser.Organizations[0];
            await axios.get(`get-archived?user_id=${user_id}&organisation_id=${org_id}`)
                .then(response => (commit('SET_ARCHIVED', response.data.data)))
                .catch(error => console.log(error))
        },
        async createTodo({ commit, state }, data) {
            const org_id = state.isUser.Organizations[0];
            await axios.post(`/create-todo?organisation_id=${org_id}`, data)
                .then((response) => commit('ADD_TODOS', response.data.data))
                .catch((error) => {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.warn(error.response.data);

                    } else if (error.request) {
                        // The request was made but no response was received
                        console.log(error.request);
                    } else {
                        // Something happened in setting up the request that triggered the Error
                        console.log('Error', error.message);
                    }
                    console.log(error.config)
                })
        },
        ADD_TRASH({ commit, state }, any) {
            let location = state.todos.findIndex(todo => todo._id.toLowerCase() === (any.toLowerCase()));

            commit('ADD_TRASH', state.todos[location])
            return state.todos.splice(location, 1);
        },
        FIND_TODO({ state }, any) {
            let location = state.todos.findIndex(todo => todo.card_id.toLowerCase() === (any.toLowerCase()));
            //let location = state.todos.findIndex(todo => todo.card_id.toLowerCase() === (id.toLowerCase()));
            // console.log(location)
            return location
        },
        ADD_ARCHIVE({ commit, state }, any) {
            let location = state.todos.findIndex(todo => todo.card_id.toLowerCase() === (any.toLowerCase()));

            commit('ADD_ARCHIVE', state.todos[location])
            return state.todos.splice(location, 1);
            //return commit('ADD_ARCHIVE', state.todos.location)
        },
        async SEARCH({ commit, dispatch }, any) {
            let value = any
            if (value != "") {
                await axios.get(`https://todo.zuri.chat/api/v1/search?key=title&q=${value}`)
                    .then((res) => {
                        console.log(res.data);
                        commit('RESULT', res.data)
                    })
                dispatch('TOGGLESHOW', false);
            } else {
                dispatch('TOGGLESHOW', true)
            }

        },
        TOGGLESHOW({ commit }, any) {
            commit('TOGGLESHOW', any)
        }
    }
}

let axios = require('axios').create({
    baseURL: 'http://localhost:3006/api',
  });
const category = {
    state: {
        questions : []
    },
    mutations: {
        setQuestions(state, payload) {
            state.questions = payload
        }
    },
    actions: {
        getQuestions({ commit }, payload) {
            axios.get('/question')
              .then(({payload})=>{
                payload = payload.sort((a,b)=>{
                  b.point.length > a.point.length
                })
                commit('setQuestions', payload);
              })
              .catch(err=>{
                console.error(err);
              })
          },
    }
}
export default category
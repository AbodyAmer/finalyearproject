import {login, logout} from '../../action/sharedActions'

const sharedState = (state= {logged: false, user:null} , action) => {

    switch(action.type){
        case login: 
        const user = action.user
        return  {
             logged: true,
             user
        }

        case logout:
        return  {
            logged: false,
            user: null
       }

       default:
       return state
    }
}

export default sharedState
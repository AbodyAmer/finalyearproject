import {select} from '../../action/lecturer/mainPage'

const currentSelected = (state ={currentModule: null, currentIntakes: null }, action) => {

    switch(action.type){
       case select: 
       return {
           currentModule: action.module,
           currentIntakes: action.intakes
       }
       default: 
       return state
    }
}
export default currentSelected
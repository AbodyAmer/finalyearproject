export const select = 'SELECT'

export const selected = (moduleIntake) => {
    
    
    const div = moduleIntake.split('.')
    const action = {
        type: select
    }
    action.module = div[0]
    action.intakes = []
    for(let i=1; i<div.length; i++){
        action.intakes = action.intakes.concat(div[i])
    }
    console.log('action ' , action.intakes)
    return action
}

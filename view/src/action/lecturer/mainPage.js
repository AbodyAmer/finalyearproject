export const select = 'SELECT'

export const selected = (moduleIntake) => {

    const div = moduleIntake.split('.')
    const action = {}
    action.module = div[0]
    for(let i=2; i<div.length; i++){
        action.intakes = action.intakes.concat(div[i])
    }
    return action
}

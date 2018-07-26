export const SELE ='SELE'

export const selectModul = (intake, module) => {

    const action = {
        type: SELE,
        intake, 
        module
    }
    return action
} 
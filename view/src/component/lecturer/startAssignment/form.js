import React, {Component, Fragment} from 'react'
import AssignmentForm from './startAssignment'
import MenuAppBar from '../appbar'
import ContainedButtons from './start'
import {connect} from 'react-redux'
import {signout} from '../../../action/sharedActions'
import axios from 'axios'
import UpdateButtons from './update'
import AlertExample from './message'


class Form extends Component {

    constructor(props){
        super(props)

        this.state ={
            open: false, 
            modules: [], 
            title:'' , 
            type: 'none', 
            newAssignment: true, 
            didMount: false, 
            date: null, 
            file: null, 
            empty: false, 
            intake: this.props.reduxState.currentSelected.currentIntakes, 
            message: '', 
            min: 0, 
            max: 0,
            show: false
        }

        this.handleClick = this.handleClick.bind(this)
        this.closeMenu  = this.closeMenu .bind(this)
        this.logout = this.logout.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)     
        this.cha = this.cha.bind(this)
        this.upload = this.upload.bind(this)
        this.startAssignment = this.startAssignment.bind(this)
        this.hide = this.hide.bind(this)
        this.updateAssignemnt = this.updateAssignemnt.bind(this)
    }

    componentDidMount(){

        var arr = this.props.reduxState.currentSelected.currentIntakes
        arr.pop()

        
        axios.post('/api/getassignment' , {intake: arr , modules: this.props.reduxState.currentSelected.currentModule})
        .then(res => {
           console.log(res)
           this.setState({
               title: res.data.assignementTitle, 
               type: res.data.assignemtType, 
               newAssignment: false, 
               didMount:true
           })
        })
        .catch(e => {
            this.setState({didMount: true})
        }) 
       

    }
   
    handleClick () {
        this.setState({open:true})
     }
 
     closeMenu() {
         this.setState({open:false})
     }
 
     logout() {
 
         axios.get('/api/logout/lecturer')
         .then( res => {
             console.log(res)
             localStorage.clear()
             console.log('this.props.history' , this.props.history)
              this.props.signout()
              this.props.history.push('/login')
            
         })
         .catch(e => {
         
              console.log(e)
         })
     }

     upload(e){
         this.setState({file: e.target.files})
     }

     startAssignment(){
         if(this.state.file === null || this.state.date === null 
          || this.state.title === '' || this.state.type === 'none')
               this.setState({message: 'Fill in all the fields' , show:true})
         else {

            var file = this.state.file[0]
       
      
            var formData = new FormData();
        
            formData.append("file" , file)
            formData.append('_method', 'POST');
        
            if(this.state.type !== 'GROUP'){
            axios.post('/api/uploadfile', formData)
            axios.post('/api/startAssignemnt' , {
                'assignementTitle':  this.state.title
                , 'assignemtType': this.state.type
                 , 'module': this.props.reduxState.currentSelected.currentModule
                  , 'intake':  this.state.intake
                  , 'dueDate': this.state.date
                  
            })
            .then(res => {
                this.setState({newAssignment: false , message:"Successful" , show:true})
         
            })
            .catch(e => console.log(e))

         }
        
        else{

            if(this.state.max < this.state.min){
                this.setState({message: 'Max member should be larger than min member' , show:true})
                return
            }
            axios.post('/api/uploadfile', formData)
            axios.post('/api/startAssignemnt' , {
                'assignementTitle':  this.state.title
                , 'assignemtType': this.state.type
                 , 'module': this.props.reduxState.currentSelected.currentModule
                  , 'intake':  this.state.intake
                  , 'dueDate': this.state.date
                  , 'max': this.state.max
                  , "min": this.state.min
            })
            .then(res => {
                this.setState({newAssignment: false , message:"Successful" , show:true})
            })
            .catch(e => console.log(e))
        }
        
     }
    }

    updateAssignemnt(){
        console.log('update')
        if(this.state.file === null || this.state.date === null 
            || this.state.title === '' || this.state.type === 'none')
                 this.setState({message: 'Fill in all the fields' , show:true})
                 else {
                     
                    var file = this.state.file[0]
       
      
                    var formData = new FormData();
                
                    formData.append("file" , file)
                    formData.append('_method', 'POST');

                     var config =  { headers : {
                     "content-type": "multipart/form-data" ,
                      "Intake" :this.state.intake, 
                      "module" :this.props.reduxState.currentSelected.currentModule
              }}
                    axios.post('/api/uploadfile', formData, config)
                   
                        axios.put('/api/updateAssignemt' , {
                            'module': this.props.reduxState.currentSelected.currentModule, 
                            'intake': this.state.intake, 
                            'assignemtType': this.state.type, 
                            'assignementTitle': this.state.title, 
                            'dueDate': this.state.date
                        })
                        .then(res => {
                            this.setState({message:"Updated Successfully" , show:true})
                        })
                        .catch(e => {
                            this.setState({message:"Updated Successfully" , show:true})
                        })
                     
                 }
    }
    hide(){
        this.setState({show:false})
    }
     cha(ty , value){ 
         if(ty === 'title')
        this.setState({title:value})
        else if (ty === 'type')
        this.setState({type:value})
        else if(ty=== 'date')
        this.setState({date:value})
        else if(ty === 'max'){
            this.setState({max:value})
        }
        else if(ty === 'min'){
            this.setState({min:value})
        }
     }
    render(){
        console.log(this.state , "from form")
        return(
            <Fragment>
                <MenuAppBar 
        open={this.state.open}
        handle={this.handleClick}
        close={this.closeMenu}
         username={this.props.reduxState.sharedState.user.name}
         logout={this.logout}
        />
           <div className='container'>
        
      {  
         this.state.didMount?
      <AssignmentForm 
        info={this.props.reduxState.currentSelected}
        states={this.state}
        handleChange={this.cha}
        click={this.upload}
        />  
        :
        <h1>Loading</h1>
    }

       { 
        this.state.newAssignment && this.state.didMount?
        <ContainedButtons 
        startAssignment={this.startAssignment}
        />:
        this.state.didMount?
        
     
        <UpdateButtons 
        updateAssignment={this.updateAssignemnt}
        />
      
        : console.log()
        }
         {
         this.state.show?
         <AlertExample 
         message={this.state.message}
         show={this.state.show}
         hide={this.hide}
         />:
         console.log()
         }
     
        </div>
        </Fragment>
        )
    }
}

function mapStateToProps(state){
    return{
        reduxState:state
    }
}

export default connect(mapStateToProps , {signout})(Form)
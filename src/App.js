import React from 'react';
import logo from './swirly.png';
//from  http://pluspng.com/png-logo-design-2476.html
//  "Use these free PNG Logo Design for your personal projects or designs."
import './App.css';
import TextInput from './TextInput'
import NamePicker from './NamePicker'
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage"

class App extends React.Component {
  state={
    messages:[],
    name:'',
    editName:false,
  }

  componentWillMount(){
    var name = localStorage.getItem('name')
    if(name){
      this.setState({name})
    }

    /* <=========================> */
    firebase.initializeApp({
      apiKey: "AIzaSyBAJVwrP5J4AhVKd5ijYtcTF9XMV6tIcY4",
      authDomain: "msgr-2.firebaseapp.com",
      projectId: "msgr-2",
      storageBucket: "msgr-2.appspot.com",
    });

    this.db = firebase.firestore();

    this.db.collection("messages").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          //console.log(change.doc.data())
          this.receive(change.doc.data())
        }
      })
    })
    /* <=========================> */
  }

  receive = (m) => {
    const messages = [m, ...this.state.messages]
    messages.sort((a,b)=>b.ts-a.ts)
    this.setState({messages})
  }

  send = (m) => {
    this.db.collection("messages").add({
      ...m,
      from: this.state.name || 'No name',
      ts: Date.now()
    })
  }

  sendMessage = (text) => {
    var m = {
      text,
      name: this.state.name,
    }
    var messages = [...this.state.messages, m]
    this.setState({messages})
  }

  setEditName = (editName) => {
    if(!editName){
      localStorage.setItem('name', this.state.name)
    }
    this.setState({editName})
  }

  render() {
    var {messages, name, editName} = this.state
    return (
      <div className="App">
        <header className="headerer">
          <img
            src={logo}
            alt="stolen logo"
            className="logo"
          />
          Chatter
          <NamePicker
            name = {name}
            editName={editName}
            // changeName={function(value){ this.setState({name: value}).bind(this)} }
            changeName={value=> this.setState({name: value})}
            setEditName={this.setEditName}
          />
        </header>
        <main className="messages">
          {messages.map((m,i)=>{
            return <Message key={i} m={m} name={name} />
          })}
        </main>
        <TextInput sendMessage={this.sendMessage} />
      </div>
    );
  }
}

export default App;

function Message(props) {
  var {m, name} = props
  return (<div className="bubble-wrap"
    from={m.from===name ? "me" : "you"}
  >
    {m.from!==name && <div className="bubble-name">{m.from}</div>}
    <div className="bubble">
      <span>{m.text}</span>
    </div>
  </div>)
}

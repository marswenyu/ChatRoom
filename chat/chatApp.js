class HelloMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: '', users:[], username_is_used:false, is_login:false, messages:[]};

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
		var that = this;
		this.socket = io();
        this.handleChange = this.handleChange.bind(this);
  
        this.socket.on('userAddingResult', function (comments) {
            console.log("userAddingResult:"+comments.result);
			that.setState({ username_is_used: !comments.result });
            that.setState({is_login:comments.result});
		});
  
        this.socket.on('userAdded', function (data) {
			
		});

        this.socket.on('allUser', function(data) {
            for (var i = 0; i < data.length; i++) { 
                console.log("userAdded:"+data[i].nickname);
            }    
        });
	}

    userAddingResult(){
        console.log("onclick:");
    }

    handleClick(){
        console.log("onclick:"+this.state.value+this.state.is_login);
        this.socket.emit("addUser",{nickname:this.state.value});
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render(){
        return (
            !this.state.is_login ? 
                (<div>
                    <input type="text" value={this.state.value} onChange={this.handleChange}/>
                    <button onClick={this.handleClick}>
                        ffe
                    </button>
                    {this.state.username_is_used && <p>This Nickname:{this.state.value} is Used</p>}
                </div>) 
                : 
                (<div>
                    <input type="text" value={this.state.value} onChange={this.handleChange}/>
                    <button onClick={this.handleClick}>
                        ddd
                    </button>
                    {this.state.username_is_used && <p>This Nickname:{this.state.value} is Used</p>}
                </div>) 
        );
    }
}
 
ReactDOM.render(
  <HelloMessage />,
  document.getElementById('chatroom')
);
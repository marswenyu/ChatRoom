var HelloMessage = React.createClass({
    render: function() {
    return <div ><input type="text"/><button>login</button></div>;
  }
});
 
ReactDOM.render(
  <HelloMessage />,
  document.getElementById('chatroom')
);
var converter = new showdown.Converter()

var Comment = React.createClass({
  render:function(){
    return  <div className="comment">
              <h3>{this.props.author}:</h3>
              <div dangerouslySetInnerHTML={{__html:converter.makeHtml(this.props.text)}} ></div>
            </div>
  }
})

var CommentList = React.createClass({
  render:function(){
    var commentNodes = this.props.data.map(function(itemData){
                return  <Comment author={itemData.author} text={itemData.text} key={itemData.id}>
                        </Comment>
              })
    return  <div className="CommentList">
              {commentNodes}
            </div>
  }
})

var CommentSubmit = React.createClass({
  getInitialState:function(){
    return {author:'',text:''}
  },
  handleSubmit:function(event){
    event.preventDefault()
    var author = ReactDOM.findDOMNode(this.refs.user).value
    var text = ReactDOM.findDOMNode(this.refs.comment).value

    console.log("submit data: author " + author + " " + text)
    if(!author || !text){
      return;
    }
    var id = Date.now()
    ReactDOM.findDOMNode(this.refs.user).value = ''
    ReactDOM.findDOMNode(this.refs.comment).value = ''
    this.props.commitCallback({author:author,text:text,id:id})
  },
  render:function(){
    return  <div>
              <form className="CommentSubmit" onSubmit={this.handleSubmit}>
                用户名：
                <input type="text" name="author" ref="user" placeholder="输入用户名" /><br/>
                评论：
                <input type="text" name="text" ref="comment" placeholder="输入评论" /><br/>
                <button type="submit">提交</button>
              </form>
            </div>
  }
})

var CommentBox = React.createClass({
  getInitialState:function(){
    return {data:[]}
  },
  getDataFromServer:function(){
    console.log("getDataFromServer")
    $.ajax({
      url:this.props.url,
      dataType:'json',
      success:function(data){
        this.setState({data:data})
      }.bind(this),
      error:function(xhr, status, err){
        console.log(this.props.url, status, err.toString())
      }.bind(this),
    })
  },
  pushDataToServer:function(data){
    var newData = this.state.data.concat(data)
    this.setState({data:newData})
    // console.log('pushDataToServer:' + newData.toString())
    $.ajax({
      url:this.props.url,
      dataType:'json',
      type:'POST',
      data:data,
      success:function(data){
        // this.setState({data:data})
      }.bind(this),
      error:function(xhr, status, error){
        console.log(this.props.url, status, error.toString())
      }.bind(this)
    })
  },
  componentDidMount:function(){
    this.getDataFromServer()
    setInterval(this.getDataFromServer, 2000)
  },
  render:function(){
    return  <div>
              <CommentList data={this.state.data}></CommentList>
              <CommentSubmit commitCallback={this.pushDataToServer}></CommentSubmit>
            </div>
  }
})

ReactDOM.render(<CommentBox url="/api/comments"/>, document.getElementById('content'))

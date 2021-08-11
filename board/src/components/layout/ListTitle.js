import React, { Component } from 'react';
import ServerRequest from '../App';
import RemoveListButton from './RemoveListButton';

export default class ListTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditable: true,
            isEditing: false,
            columnName: props.columnName,
            columnID: props.columnID
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleKey = this.handleKey.bind(this);
        this.elBlurHandler = this.elBlurHandler.bind(this);
        this.initDelete = this.initDelete.bind(this);
        this.elMouseEnterHandler = this.elMouseEnterHandler.bind(this);
        this.wrapperRef = React.createRef();
        
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleHitEnter = this.handleHitEnter.bind(this);
        this.changeColumnTitle = this.changeColumnTitle.bind(this);
        this.columnIsEditing = this.columnIsEditing.bind(this);
    }

    handleClick(e) {
        this.elMouseLeaveHandler(e);
        let el = e.target;
        
        let inActive = el.classList.contains('inactive');

        if (inActive) {
            list.options.disabled = true;
            el.disabled = false;
            el.classList.remove('inactive');
            el.classList.add('active');
            el.select();
        }
        this.setState({
            isEditable: true
        });
        if (this.state.isEditable && !this.state.isEditing) {
            el.contentEditable = true;
            e.preventDefault();
            el.focus();
            document.execCommand('selectAll',false,null);
            document.body.addEventListener('keydown', this.handleKey);
            document.body.addEventListener('blur', this.elBlurHandler);
            el.classList.add('editing');
        } else {
            document.body.removeEventListener('keydown', this.handleKey);
        }
    }

    handleKey(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            e.target.blur();
          }
          
          let el = e.target;
          if (el.classList.contains('add-card')) {
            el.classList.add('pending'); 
          }
            
          if (el.parentElement.className === 'list initial') {
            el.parentElement.className = 'list pending';
          }       
    }

    elBlurHandler (e) {
        let el = e.target
        el.contentEditable = false;
        el.classList.remove('editing');
        
        if (el.classList.contains('pending')) {
            el.className = 'card removable editable';
            let newEl = document.createElement('div');
            newEl.className = 'add-card editable';
            let text = document.createTextNode('Add another card');
            newEl.appendChild(text);
            el.parentNode.appendChild(newEl);
            
            el.parentNode.querySelector('.content').appendChild(el);
        }
        
        if (el.parentElement.className === 'list initial') {
            el.parentElement.className = 'add-list';
        }
        
        if (el.parentElement.className === 'list pending') {
            el.parentElement.className = 'list';
            el.className = 'title removable editable';
            let newContent = document.createElement('div');
            newContent.className = 'content';
            el.parentElement.appendChild(newContent);
            
            let newEl = document.createElement('div');
            newEl.className = 'add-card editable';
            let text = document.createTextNode('Add another card');
            newEl.appendChild(text);
            el.parentNode.appendChild(newEl);
            
            document.querySelector('#KanbanBoard').appendChild(el.parentElement);
            
            initContent();
            
            let addList = document.createElement('div');
            addList.className = 'add-list';
            let title = document.createElement('div');
            title.className = 'title editable';
            text = document.createTextNode('Add another list');
            title.appendChild(text);
            addList.appendChild(title);
            document.querySelector('body').appendChild(addList);
        }
        
        this.initDelete();
    }

    initDelete() {
        let editables = document.querySelectorAll('.editable');

        for (item of editables) {
          item.addEventListener('mouseenter', elMouseEnterHandler);
          item.addEventListener('mouseleave', elMouseLeaveHandler);
        }
    }

    elMouseEnterHandler(e) {
        let el = e.target;
        let isRemovable = el.classList.contains('removable');
        
        if (isRemovable) {
          let del = document.createElement('span');
          del.className = 'del';
          del.innerHTML = '&times;';
          el.appendChild(del);
      
          el.addEventListener('click', deleteHandler);
        }
      }

    elMouseLeaveHandler(e) {
        let del = e.target.querySelector('span');
        if (del) e.target.removeChild(del);
    }

    deleteHandler(e) {
        var parent = e.target.parentElement;
        
        if (parent.classList.contains('card')) {
            parent.parentElement.removeChild(parent);
        }
        
        if (parent.classList.contains('title')) {
            parent.parentElement.parentElement.removeChild(parent.parentElement);
        }
    }

    changeColumnTitle(content) {
        const myCallback = (response, status) => {
            
            if (status == 200) {
                this.setState({
                    columnName: response['column_name']
                })
            }
        }
        ServerRequest(myCallback, "/change_column_name/", "POST", {id: this.state.columnID, column_name: content})
    }

    columnIsEditing() {
        this.setState({
            isEditing: false
        })
        let el = this.wrapperRef.current
        el.classList.remove('editing');
        el.contentEditable = false
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.columnIsEditing();
            // todo: find a way to target the card text content when clicking away
            if (event.currentTarget.textContent && this.state.columnName != event.currentTarget.textContent) {
                this.changeColumnTitle(event.currentTarget.textContent);
            }
        }
    }

    handleHitEnter(event) {
        if (event.key === 'Enter') {
            this.columnIsEditing();
            
            if (event.currentTarget.textContent && this.state.columnName != event.currentTarget.textContent) {
                this.changeColumnTitle(event.currentTarget.textContent);
            }
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount () {
        document.body.removeEventListener('keydown', this.handleKey);
        document.body.removeEventListener('blur', this.elBlurHandler);
        document.body.removeEventListener('mouseenter', elMouseEnterHandler);
        document.body.removeEventListener('mouseleave', elMouseLeaveHandler);
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render() {
        return ( 
            <div className="list-title-container">
            <div className="list-name editable" onClick={this.handleClick} onKeyDown={this.handleHitEnter} ref={this.wrapperRef}>{this.state.columnName}</div>
            <RemoveListButton listID={this.state.columnID} refreshBoard={this.props.refreshBoard}/>
            </div>
        )
    }
}
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ServerRequest from '../App';
import { useDrag } from 'react-dnd'
import { ItemTypes } from '../../utils/items';
import onClickOutside from "react-onclickoutside";

// export default class Card extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             isEditable: true,
//             isEditing: false,
//             cardName: props.cardName,
//             cardID: props.cardID
//         }

//         this.handleClick = this.handleClick.bind(this);
//         this.handleKey = this.handleKey.bind(this);
//         this.elBlurHandler = this.elBlurHandler.bind(this);
//         this.initDelete = this.initDelete.bind(this);
//         this.elMouseEnterHandler = this.elMouseEnterHandler.bind(this);
//         this.wrapperRef = React.createRef();
		
//         this.handleClickOutside = this.handleClickOutside.bind(this);
//         this.handleHitEnter = this.handleHitEnter.bind(this);
//         this.changeCardTitle = this.changeCardTitle.bind(this);
//         this.cardIsEditing = this.cardIsEditing.bind(this);
//     }

//     // const [collectedProps, drag] = useDrag({
//     //     item: {
//     //         type: ItemTypes.CARD,
//     //     }
//     // })

//     handleClick(e) {
//         this.elMouseLeaveHandler(e);
//         let el = e.target;
		
//         let inActive = el.classList.contains('inactive');

//         if (inActive) {
//             list.options.disabled = true;
//             el.disabled = false;
//             el.classList.remove('inactive');
//             el.classList.add('active');
//             el.select();
//         }
//         this.setState({
//             isEditable: true
//         });
//         if (this.state.isEditable && !this.state.isEditing) {
//             el.contentEditable = true;
//             e.preventDefault();
//             el.focus();
//             document.execCommand('selectAll',false,null);
//             document.body.addEventListener('keydown', this.handleKey);
//             document.body.addEventListener('blur', this.elBlurHandler);
//             el.classList.add('editing');
//         } else {
//             document.body.removeEventListener('keydown', this.handleKey);
//         }
//     }

//     handleKey(e) {
//         if (e.keyCode === 13) {
//             e.preventDefault();
//             e.target.blur();
//           }
		  
//           let el = e.target;
			
//           if (el.parentElement.className === 'list initial') {
//             el.parentElement.className = 'list pending';
//           }       
//     }

//     elBlurHandler (e) {
//         let el = e.target
//         el.contentEditable = false;
//         el.classList.remove('editing');
		
//         if (el.parentElement.className === 'list initial') {
//             el.parentElement.className = 'add-list';
//         }
		
//         if (el.parentElement.className === 'list pending') {
//             el.parentElement.className = 'list';
//             el.className = 'title removable editable';
//             let newContent = document.createElement('div');
//             newContent.className = 'content';
//             el.parentElement.appendChild(newContent);
			
//             let newEl = document.createElement('div');
//             newEl.className = 'add-card editable';
//             let text = document.createTextNode('Add another card');
//             newEl.appendChild(text);
//             el.parentNode.appendChild(newEl);
			
//             document.querySelector('#KanbanBoard').appendChild(el.parentElement);
			
//             initContent();
			
//             let addList = document.createElement('div');
//             addList.className = 'add-list';
//             let title = document.createElement('div');
//             title.className = 'title editable';
//             text = document.createTextNode('Add another list');
//             title.appendChild(text);
//             addList.appendChild(title);
//             document.querySelector('body').appendChild(addList);
//         }
		
//         this.initDelete();
//     }

//     initDelete() {
//         let editables = document.querySelectorAll('.editable');

//         for (item of editables) {
//           item.addEventListener('mouseenter', elMouseEnterHandler);
//           item.addEventListener('mouseleave', elMouseLeaveHandler);
//         }
//     }

//     elMouseEnterHandler(e) {
//         let el = e.target;
//         let isRemovable = el.classList.contains('removable');
		
//         if (isRemovable) {
//           let del = document.createElement('span');
//           del.className = 'del';
//           del.innerHTML = '&times;';
//           el.appendChild(del);
	  
//           el.addEventListener('click', deleteHandler);
//         }
//         console.log("Hello")
//       }

//     elMouseLeaveHandler(e) {
//         let del = e.target.querySelector('span');
//         if (del) e.target.removeChild(del);
//     }

//     deleteHandler(e) {
//         var parent = e.target.parentElement;
		
//         if (parent.classList.contains('card')) {
//             parent.parentElement.removeChild(parent);
//         }
		
//         if (parent.classList.contains('title')) {
//             parent.parentElement.parentElement.removeChild(parent.parentElement);
//         }
//     }

//     changeCardTitle(content) {
//         const myCallback = (response, status) => {
			
//             if (status == 200) {
//                 this.setState({
//                     cardName: response['title']
//                 })
//             }
//         }
//         ServerRequest(myCallback, "/change_task_title/", "POST", {id: this.state.cardID, title: content})
//     }

//     cardIsEditing() {
//         this.setState({
//             isEditing: false
//         })
//         let el = this.wrapperRef.current
//         el.classList.remove('editing');
//         el.contentEditable = false
//     }

//     handleClickOutside(event) {
//         if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
//             this.cardIsEditing();
//             // todo: find a way to target the card text content when clicking away
//             if (event.currentTarget.textContent && this.state.cardName != event.currentTarget.textContent) {
//                 this.changeCardTitle(event.currentTarget.textContent);
//             }
//         }
//     }

//     handleHitEnter(event) {
//         if (event.key === 'Enter') {
//             this.cardIsEditing();
//             if (event.currentTarget.textContent && this.state.cardName != event.currentTarget.textContent) {
//                 this.changeCardTitle(event.currentTarget.textContent);
//             }
//         }
//     }

//     componentDidMount() {
//         document.addEventListener('mousedown', this.handleClickOutside);
//     }

//     componentWillUnmount () {
//         document.body.removeEventListener('keydown', this.handleKey);
//         document.body.removeEventListener('blur', this.elBlurHandler);
//         document.body.removeEventListener('mouseenter', elMouseEnterHandler);
//         document.body.removeEventListener('mouseleave', elMouseLeaveHandler);
//         document.removeEventListener('mousedown', this.handleClickOutside);
//     }

//     render() {
//         return ( 
//             <div className="card editable" onClick={this.handleClick} onKeyDown={this.handleHitEnter} ref={this.wrapperRef}>{this.state.cardName}</div>
//         )
//     }
// }

function Card(props) {
	const [isEditable, setIsEditable] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [cardName, setCardName] =  useState(props.cardName);
	const [cardID, setCardID] =  useState(props.cardID);
	const columnID = props.columnID;
	const wrapperRef = React.useRef();


	useEffect(() => {
		return () => {
			document.body.removeEventListener('keydown', handleKey);
			document.body.removeEventListener('blur', elBlurHandler);
			document.body.removeEventListener('mouseenter', elMouseEnterHandler);
			document.body.removeEventListener('mouseleave', elMouseLeaveHandler);
			document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [])

	const [{isDragging}, drag] = useDrag({
		item: {
			type: ItemTypes.CARD,
			id: cardID,
			oldColumn: columnID
		},
		collect: monitor => ({
            isDragging: !!monitor.isDragging()
        }),
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoveredRect = ref.current.getBoundClientRect();
            const hoverMiddleY = (hoveredRect.bottom = hoveredRect.top) / 2;
            const mousePosition = monitor.getClientOffset();

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            moveItem(dragIndex, hoverIndex) 
            item.index = hoverIndex;
            
        }

	})

	const handleClick = (e) => {
        elMouseLeaveHandler(e);
        let el = e.target;
		
        let inActive = el.classList.contains('inactive');

        if (inActive) {
            list.options.disabled = true;
            el.disabled = false;
            el.classList.remove('inactive');
            el.classList.add('active');
            el.select();
		}
		
		setIsEditable(true);

        if (isEditable && !isEditing) {
            el.contentEditable = true;
            e.preventDefault();
            el.focus();
            document.execCommand('selectAll',false,null);
            document.body.addEventListener('keydown', handleKey);
            document.body.addEventListener('blur', elBlurHandler);
			el.classList.add('editing');
			setIsEditing(true);
        } else {
            document.body.removeEventListener('keydown', handleKey);
        }
	}

	const handleKey = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            e.target.blur();
          }
		  
          let el = e.target;
			
          if (el.parentElement.className === 'list initial') {
            el.parentElement.className = 'list pending';
          }       
	}

	const elMouseEnterHandler = (e) => {
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
	
	const elBlurHandler = (e) => {
		let el = e.target
        el.contentEditable = false;
        el.classList.remove('editing');
		
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
        initDelete();
	}
	
	const initDelete = () => {
        let editables = document.querySelectorAll('.editable');

        for (item of editables) {
          item.addEventListener('mouseenter', elMouseEnterHandler);
          item.addEventListener('mouseleave', elMouseLeaveHandler);
        }
    }

	const elMouseLeaveHandler = (e) => {
        let del = e.target.querySelector('span');
        if (del) e.target.removeChild(del);
    }

	const handleClickOutside = (event) => {		
		setIsEditing(false);
		// todo: find a way to target the card text content when clicking away
		if (cardName != event.currentTarget.textContent) {
			changeCardTitle(event.currentTarget.textContent);
		}
	}

	const handleHitEnter = (event) => {
        if (event.key === 'Enter') {
			setIsEditing(false);
            if (cardName != event.currentTarget.textContent) {
                changeCardTitle(event.currentTarget.textContent);
			}
        }
    }

	const changeCardTitle = (content) => {
		const myCallback = (response, status) => {
			if (status == 200) {
				setCardName(response['title']);
				props.refreshCard();
			}
		}
		let change_url;
		if (content === '') {
			change_url = "/delete_task/";
		} else {
			change_url = "/change_task_title/";
		}
		ServerRequest(myCallback, change_url, "POST", {id: cardID, title: content})
	}

	return (
		<div className={`card editable ${isEditing ? 'editing': ''} `} ref={drag} onClick={handleClick} onKeyDown={handleHitEnter} contentEditable={`${isEditing ? 'true': 'false'}`}>{cardName}</div>
	)
}

export default onClickOutside(Card);

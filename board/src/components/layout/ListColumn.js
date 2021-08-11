import React, { useState, useEffect} from 'react';

import Card from './Card';
import ListTitle from './ListTitle';
import ServerRequest from '../App';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/items';


 function ListColumn(props) {

	const [columnName, setColumnName] = useState(props.columnData['column_name'])
	const columnID = props.columnData['id'];
	const new_card_title = 'New Card'
	const board_id = props.boardID;
	let allColumnData = props.allColumnData;

	const addCard = () => {
		const myCallback = (response, status) => {
			if (status == 200) {
				// let temp_new_cards = [...cardIDs]
				// temp_new_cards.push({
				//     id: response['id'],
				//     title: response['title']
				// })
				// setCards(temp_new_cards);
				refreshCard();
			}
		}
		ServerRequest(myCallback, `/add_task/${columnID}/`, "POST", {title: new_card_title})    
	}
	const changeCardColumn = (cardContext) => {
		const myCallback = (response, status) => {
			if (status == 200) {
				// console.log(response);
				let temp_all_columns = [...allColumnData];
				// use to update state without server request
				// let oldColumn = temp_all_columns.filter((column, i) => column['id'] == response['oldColumnID']);
				// let changedOldTasks = oldColumn[0]['tasks'].filter((card, i) => card['id'] != response['id']);
				// // remove task from old column
				// temp_all_columns.filter((column, i) => column['id'] == response['oldColumnID'])[0]['tasks'] = changedOldTasks
				// // append task from new column
				// temp_all_columns.filter((column, i) => column['id'] == response['newColumnID'])[0]['tasks'].push({'id': response['id'], 'title': response['title']});
				// // setAllColumnData(temp_all_columns);
				props.handleColumnChange(temp_all_columns);
			}
		}
		if (cardContext['oldColumn'] != columnID) {
			ServerRequest(myCallback, `/change_task_column/${cardContext['id']}/`, "POST", {oldColumnID: cardContext['oldColumn'], newColumnID: columnID})  
		}
	}

	const refreshCard = () => {
		props.handleColumnChange([...allColumnData]);
	}

	const [{ isOver }, drop] = useDrop({
		accept: ItemTypes.CARD,
		drop: (item, monitor) => changeCardColumn(item),
		collect: monitor => ({
			isOver: !!monitor.isOver(),
		})
	})
	let highlightClass = isOver ? "highlight-region": "";
	return ( 
			<div className="list-column" ref={drop}>
				<ListTitle columnName={columnName} columnID={columnID} refreshBoard={refreshCard}/>
				<div className={`content ${highlightClass}`}>
					{allColumnData.filter((column, i) => column['id'] == columnID)[0]['tasks']
					.map((card, i) => {
						return <Card key={card['id']} cardName={card['title']} cardID={card['id']} columnID={columnID} refreshCard={refreshCard} />
					})}
				</div>
				<div className="add-card editable" onClick={addCard}>Add another card</div>
			</div>
	)
}

export default ListColumn;
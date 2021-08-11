import React , {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';

import ListColumn from './layout/ListColumn';
import Header from './layout/navbar/Header';
import AddColumnButton from './layout/AddColumn';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'

const current_domain  = 'http://127.0.0.1:8000'

function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

export default function serverRequest(callback, endpoint, method, data=null, logout=false) {
	let jsonData;
	if (data) {
		jsonData = JSON.stringify(data);
	}
	const xhr = new XMLHttpRequest();
	let url;
	if (logout) {
		url = current_domain + `/logout/`;
		return url
	} else {
		url = current_domain + `/board/api${endpoint}`;
	}
	const responseType = "json";
	const csrftoken = getCookie('csrftoken');
	xhr.open(method, url);
	xhr.setRequestHeader("Content-Type", "application/json");
	if (csrftoken) {
		xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest");
		xhr.setRequestHeader("X-Requested_With", "XMLHttpRequest");
		xhr.setRequestHeader("X-CSRFToken", csrftoken);
	}
	xhr.responseType = responseType;
	xhr.onload = function() {
		callback(xhr.response, xhr.status);
	}
	xhr.onerror = function (e) {
		console.log(e);
		callback({"message": "The request was an error"}, 400);
	}
	xhr.send(jsonData);
}

function App() {
	let url = window.location.href;
	let matches = url.match('board\/([^&]*)\/');
	let boardID = matches[1];
	const new_column_title = 'New Column';
	const [columns, setColumns] = useState([]);
	const [allColumnData, setAllColumnData] = useState([]);
	const [boardName, setBoardName] = useState();
	const [username, setUsername] = useState();
	const  [changeColumn, setChangeColumn] = useState();

	useEffect(() => {
		const myCallback = (response, status) => {
			if (status == 200) {
				if (response['response']) {
					let columnsData = response['response'][0]['columns'];
					let temp_all_columns = [];
					temp_all_columns.push(columnsData);
					setAllColumnData(columnsData);
					
					let temp_new_columns = [];
					
					for (let i=0; i < columnsData.length; i+=1) {
						temp_new_columns.push(<ListColumn key={columnsData[i]['id']} number={i} columnData={columnsData[i]} allColumnData={columnsData} boardID={response['response'][0]['id']} handleColumnChange={handleColumnChange} />);    
					}
					setColumns(temp_new_columns);
					setBoardName(response['response'][0]['board_name']);
					setUsername(response['response'][0]['username']);
				}
			}
			
		}
		serverRequest(myCallback, `/${boardID}/`, "GET")
	}, [])

	useEffect(() => {
		const myCallback = (response, status) => {
			if (status == 200) {
				if (response['response']) {
					let columnsData = response['response'][0]['columns'];
					let temp_all_columns = [];
					temp_all_columns.push(columnsData);
					setAllColumnData(columnsData);
					
					let temp_new_columns = [];
					
					for (let i=0; i < columnsData.length; i+=1) {
						temp_new_columns.push(<ListColumn key={columnsData[i]['id']} number={i} columnData={columnsData[i]} allColumnData={columnsData} boardID={response['response'][0]['id']} handleColumnChange={handleColumnChange} />);    
					}
					setColumns(temp_new_columns);
					setBoardName(response['response'][0]['board_name']);
					setUsername(response['response'][0]['username']);
				}
			}
			
		}
		serverRequest(myCallback, `/${boardID}/`, "GET")
	}, [changeColumn])

	const handleColumnChange = (newColumnData) => {
		setAllColumnData(newColumnData);
		setChangeColumn(true);
		setChangeColumn(false);
	}

	const addColumn = () => {
		const myCallback = (response, status) => {
			if (status == 200) {
				let columnsData = response;
				let temp_new_columns = [...columns];
				temp_new_columns.push(<ListColumn key={columnsData['id']} number={temp_new_columns.length + 1} tasks={columnsData['tasks']} columnData={columnsData} boardID={columnsData['boardID']}/>);
				handleColumnChange(temp_new_columns);
				//setColumns(temp_new_columns);
				// create a dragzone 
			}
		}
		serverRequest(myCallback, `/add_column/${boardID}/`, "POST", {column_name: new_column_title});
	} 

	return (
		<DndProvider backend={HTML5Backend}>
			<div>
				<Header boardName={boardName} boardID={boardID} username={username}/>
				<div id="KanbanBoard">
					{columns}
					<AddColumnButton boardID={boardID} onClick={addColumn}/>
				</div>
			</div>
	   </DndProvider>
	)
}

ReactDOM.render(<App />, document.getElementById('app'));



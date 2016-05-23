import React from 'react';
import {
	Icon,
	Form,
	Input,
	Row,
	Col,
	Button,
	Modal,
	Pagination
}
from 'antd';
import {
	polyfill
}
from 'es6-promise';
import fetch from 'isomorphic-fetch';
import _ from "underscore";
import moment from "moment";
import Case from "./case";
import PubSub from "pubsub-js";
import './lists.less';

import {
	case1 as caseData
}
from '../datas/datas.js';

export default class lists extends React.Component {
	static propTypes = {
		name: React.PropTypes.string,
	};

	constructor(props) {
		super(props);
		// console.log(this.props);
		this.state = {
			data: this.props.data,
			url: this.props.url,
			selected: new Array(),
			cases: new Array(),
			visible: false,
			modalTitle: '',
			modalContent: '',
			pageSize: this.props.pageSize || 10,
			pages: '',
			footer: '',
			width: 600
		};
	}

	componentDidMount() {
		// console.log(this.state.data);
		let cases = _.map(this.state.data.cases.slice(0, this.state.pageSize), (text, index) => {
			return (
				<Row className="text" key={text._id}>
					<Col span="1" style={{textAlign:"center"}}>
						{index+1}、
					</Col>
					<Col span="20">
						{text.title}&nbsp;&nbsp;&nbsp;&nbsp;
					</Col>
					<Col span="3">
						<Button type="primary" size="small" onClick={this.showModal.bind(this,text)}>查看全文</Button>
					</Col>
				</Row>
			)
		});
		let pages = <Pagination size='small' pageSize={this.state.pageSize} onChange={this.onChange.bind(this)} total={this.state.data.cases.length} />;
		this.setState({
			selected: this.state.data.selected,
			cases: cases,
			pages: pages,
		});
		this.pubsub_token = PubSub.subscribe('_back', function(topic, product) {
			this.setState({
				...product
			});
		}.bind(this));
	}

	clickTitle(e) {
		e.preventDefault();
	}

	showModal(text) {
		// fetch(`${this.state.url}/cases/${text._id}`)
		// 	.then(res => res.json())
		// 	.then(res => {
		// 		this.setState({
		// 			visible: true,
		// 			modalTitle: res.name,
		// 			modalContent: <ReactMarkdown source={res.content} />,
		// 		});
		// 	}).catch((error) => {
		// 		console.error(error);
		// 	});
		// 	
		this.setState({
			visible: true,
			modalContent: <Case data={caseData} />,
		});
	}
	handleOk() {
		this.setState({
			visible: false,
			modalTitle: '',
			modalContent: '',
		});
	}
	handleCancel(e) {
		this.setState({
			visible: false,
			modalTitle: '',
			modalContent: '',
		});
	}
	onChange(page) {
		console.log(page);
		let cases = _.map(this.state.data.cases.slice((page - 1) * this.state.pageSize, page * this.state.pageSize), (text, index) => {
			return (
				<Row className="text" key={text._id}>
					<Col span="1" style={{textAlign:"center"}}>
						{index+1}、
					</Col>
					<Col span="20">
						{text.title}&nbsp;&nbsp;&nbsp;&nbsp;
					</Col>
					<Col span="3">
						<Button type="primary" size="small" onClick={this.showModal.bind(this,text)}>查看全文</Button>
					</Col>
				</Row>
			)
		});
		this.setState({
			selected: this.state.data.selected,
			cases: cases,
		});
	}
	render() {
		return (
			<div>
				<Row>
					<div className="header">
						<span className="title">
							<a title="点击进入高级检索" 
							onClick={this.clickTitle.bind(this)}>
							{this.state.data?this.state.data.selected.name:''}&nbsp;&nbsp;&nbsp;&nbsp;(共{this.state.data.cases.length}篇) 
							</a>
						</span>
					</div>
					<div className="lists">
						{this.state.cases}
						<Row className="text pages">
							<Col span="1">
								&nbsp;
							</Col>
							<Col span="21" className="">
								{this.state.pages}
							</Col>
							<Col span="2">
								&nbsp;
							</Col>
						</Row>
					</div>
				</Row>
				<div>
			        <Modal title={this.state.modalTitle} visible={this.state.visible}
			          footer={this.state.footer}
			          width={this.state.width}
			          style={{ top: 20 }}
			          onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}>
						{this.state.modalContent}
			        </Modal>
		      	</div>
	      	</div>
		);
	}
}
import PouchDB from 'pouchdb';
import _ from 'lodash';

export default class Cart {
	constructor(db){
		this.cartContents = {};
	 	this.db = new PouchDB(db);		
	}
}

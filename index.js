import PouchDB from 'pouchdb';
import _ from 'lodash';

export default class Cart {
	constructor(db){
		this.cartContents = {};
	 	this.db = new PouchDB(db);

		this.getCart();
	}

	getCart() {
		let self = this;
		let docs = {
			rows: [],
			total_rows: 0,
			total_quantity: 0,
			total_value: 0,
		};
		return this.db.allDocs({
			include_docs: true
		}).then(function(response){
				docs.total_rows = response.total_rows;
				for(let d = 0; d < response.rows.length; d++){
					if(response.rows[d].doc){
						docs.rows.push(response.rows[d].doc)

						let quantity = parseInt(response.rows[d].doc['quantity']);
						let price = response.rows[d].doc['price'].replace(/[^\d.-]/g, '');
						price = parseFloat(price);

						docs.total_quantity += quantity;
						docs.total_value += price * quantity;
					}

				}
				self.cartContents = docs;
				return docs;

		}).catch(function(err){
			console.log(err);

			return false;
		});
	}

	addToCart(product) {
		let self = this;
		let productExist = _.find(self.cartContents.rows, {id: product.id});
		if(!productExist){
			return this.db.post(product).then(function() {
				return true;
			}).catch(function(err) {
				console.log(err);
				return false;
			});
		}else{
			let updatedProduct = productExist;
			updatedProduct.quantity += product.quantity;
			return self.db.put(updatedProduct).then(function(r) {
				return true;
			}).catch(function(err) {
				console.log(err);
				return false;
			});
		}
	}

	updateCart(product) {
		let self = this;
		let productExist = _.find(self.cartContents.rows, {id: product.id});
		if(productExist){
			let updatedProduct = productExist;
			updatedProduct.quantity = product.quantity;
			return self.db.put(updatedProduct).then(function(r) {
				return true;
			}).catch(function(err) {
				console.log(err);
				return false;
			});
		}
	}

}

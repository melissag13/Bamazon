var mysql = require('mysql');
var prompt = require('prompt');

var connection = mysql.createConnection({
	host:'localhost',
	user: 'root',
	password: '',
	database: 'Bamazon'
});

displayInventory();

function displayInventory() {
	connection.query('SELECT ItemId, ProductName, DepartmentName, Price FROM products', function(err, res) {
		if(err){
			throw err;
		}else{
		    console.log(res);
		    buyItem();
		}
	})
}

function buyItem() {
  var schema = {
    properties: {
      productid: {
        description: "Enter ID of product you would like to purchase ",
        pattern: /^[0-9]+$/,
        message: 'Invalid ID ',
        required: true
      },
      qty: {
        description: 'Enter the quantity you would like ',
        pattern: /^[0-9]+$/,
        message: 'Invalid quantity ',
        required: true
      }
    }
  };

  prompt.get(schema, function(err2, res2) {
    checkInventory(res2.productid, res2.qty)
  });
}


function checkInventory(id, qty) {
  var query = 'SELECT StockQuantity, Price FROM products WHERE ItemId = ' + id;
  connection.query(query, function(err, res) {
    if (err) {
      throw err;
    } else if (res.length <= 0) {
      console.log('Invalid item ID');
      buyItem();
    } else if (res[0].StockQuantity < qty) {
      console.log('Insufficient quantity');
      buyItem();
    } else {
      console.log('Your total cost for today: $' + (res[0].Price * qty).toFixed(2));
      var updateQty = res[0].StockQuantity - qty;
      updateInventory(id, updateQty);
    }
  });
 
}



function updateInventory(id, updateQty) {
  var query = 'UPDATE products SET StockQuantity = ' + updateQty + ' WHERE ItemId = ' + id;
  connection.query(query, function(err, res) {
    if (err) {
      throw err;
    } else {
     console.log('Inventory refreshed')
    }

  });
}
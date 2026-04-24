# Fencing Company Management API
> A robust RESTful API and database backend built with Node.js, Express, and MongoDB. This project manages customer orders, product catalogs, and physical inventory for a specialized fencing construction company.
>
## 🚀 Features
### RESTful CRUD: 
> Complete endpoints for Creating, Reading, Updating, and Deleting orders.
>
### ACID Transactions: 
> Ensures data integrity by deducting inventory only when an order is successfully placed. If stock is insufficient, the order is automatically rolled back.
>
### Relational Logic in NoSQL: 
> Uses MongoDB Aggregation Pipelines ($lookup) to link Customers, Fences, and Inventory collections.
>

## 🛠️ Prerequisites
### Node.js: v18 or higher.
### MongoDB: Must be configured as a Replica Set to support transactions.

# 📦 Setup & Installation
## 1. MongoDB Configuration
> Since this project uses multi-document transactions, you must convert your standalone MongoDB instance into a single-node Replica Set:
>
### Edit Config:
### Linux
#### Bash:
```
    sudo nano /etc/mongod.conf
```
### Windows:
> Open in notepad in admin mode
```
    C:\Program Files\MongoDB\Server\<version>\bin\mongod.cfg
```
### Add Replication: Uncomment the replication section and add a name:
#### YAML:
```
replication:
    replSetName: "rs0"
```
### Restart & Initialize:
#### Linux
#### Bash
```
    sudo systemctl restart mongod
    mongosh --eval "rs.initiate()"
```
#### Windows
> Open services.msc, find MongoDB Server, and select restart
#### Powershell
```
    mongosh --eval "rs.initiate()"
```
## 2. Backend Setup
### Clone the project and enter the directory:
#### Bash
```
    git clone https://github.com/lukeperras15-alt/fencing-company-api.git
```
### Install dependencies:

#### Linux
```
    npm install express mongodb
```
#### Windows
```
    npm install
```
### Start the server:
#### Terminal
```
    node server.js
```
# 📑 API Reference
## Orders Endpoint: http://localhost:3000/orders

| Method | Endpoint    | Description                       |
|--------|-------------|----------------------------------:|
| GET:   | /orders     | Retrieve all orders               |
| GET:   | /orders/:id | Retrieve a specific order by ID   |
| POST:  | /orders     | Creates a new order               |
| PUT:   | /orders/:id | Update order details              |
| DELETE:| /orders/:id | Remove an order from the database |

## Example POST Body
#### JSON
```
{
  "_id": 7001,
  "customerId": 1,
  "fenceId": 101,
  "totalLinearFeet": 150,
  "status": "Scheduled"
}
```
# 🧪 Testing Transactions
> To verify that the database safely handles inventory deductions during an order, run the included test script:
>
#### Bash
```
    node testTransaction.js
```
>This script will attempt to create an order and decrement the stockAvailable field in the inventory collection. It will fail and rollback if the inventory is too low.
>
# 🏗️ Technologies Used
## Backend: Node.js, Express.js
## Database: MongoDB (Replica Set mode)
## Testing: Postman / Thunder Client
#### Developed as part of a Database Management project.
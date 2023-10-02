const { DataTypes, INTEGER, FLOAT, Sequelize } = require('sequelize');
const sequelize = require('../Db_connection/config');


const uniqueData = (tableName, fieldName) => ({
  unique: {
    name: `unique_${fieldName}`,
    msg: `This ${tableName} ${fieldName} already exists.`,
    fields: [fieldName],
  },
  validate: {
    notEmpty: {
      args: true,
      msg: `${tableName} ${fieldName} cannot be empty.`,
    },
    isUnique(value, next) {
      this.constructor.findOne({
        where: sequelize.where(sequelize.fn('lower', sequelize.col(fieldName)), sequelize.fn('lower', value)),
      })
        .then((existingRecord) => {
          if (existingRecord) {
            return next(`This ${tableName} ${fieldName} already exists.`);
          }
          next();
        })
        .catch(next);
    },
  },
});

// Define the User model
const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
...uniqueData('users','email')   
 },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: { // Add this field
      type: DataTypes.DATE,
      allowNull: true, // Depending on your requirements, you can set it to false if it's mandatory
    },
  }, { freezeTableName: true });
  


  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      ...uniqueData('Category','name') 
    },
  }, { freezeTableName: true });
  

const Todo = sequelize.define('TodoList', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  todoHeadline: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  todoDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  completedByTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  categoryId: { // Add the new column categoryId
    type: DataTypes.INTEGER, // Assuming categoryId is of type INTEGER, change it if it's a different data type
    allowNull: true, // Modify allowNull as per your requirements
  },
}, { freezeTableName: true });



  Todo.belongsTo(User, {
    foreignKey: 'userId', // Name of the foreign key column in EmployeeSalary
    targetKey: 'id', // Name of the primary key column in Employee
    as:"userTodos"
  });
  Todo.belongsTo(Category, {
    foreignKey: 'categoryId', // Name of the foreign key column in EmployeeSalary
    targetKey: 'id', // Name of the primary key column in Employee
    as:"Todocategory"
  });

  module.exports={
    User,
    Todo,
    Category
  }
const sequelize = require("sequelize");

module.exports = (sequelize,DataTypes) =>{ 
  const Employees = sequelize.define("Employees", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: {
        args: true,
        msg: 'Employee ID already exists.',
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 10],
      },
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfJoining: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isBefore: new Date().toISOString(),
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Employees;
};

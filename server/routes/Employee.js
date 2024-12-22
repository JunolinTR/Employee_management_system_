const express = require("express");
const router = express.Router();
const { Employees } = require("../models");
const { Op } = require("sequelize");

//get all employee
router.get("/", async (req, res) => {
  try {
    const listOfEmp = await Employees.findAll();
    res.json(listOfEmp);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


//create employee rec
router.post("/", async (req, res) => {
  const emp = req.body;

  try {
    const existingEmployee = await Employees.findOne({
      where: {
        [Op.or]: [{ employeeId: emp.employeeId }, { email: emp.email }]
      }
    });

    if (existingEmployee) {
      const errors = {};
      if (existingEmployee.employeeId === emp.employeeId) {
        errors.employeeId = "Employee ID already exists";
      }
      if (existingEmployee.email === emp.email) {
        errors.email = "Email already exists";
      }
      return res.status(400).json({ errors });
    }

    const newEmployee = await Employees.create(emp);
    res.status(201).json({ message: "Employee added successfully", data: newEmployee });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


//del emp
router.delete("/:id", async (req, res) => {
  const employeeId = req.params.id;

  try {
    const employee = await Employees.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employee.destroy();
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


//update emp details
router.get('/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const employee = await Employees.findByPk(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

//edit
router.put('/:id', async (req, res) => {
  const {id} = req.params;
  const emp = req.body;
  try {
    const updatedEmployee = await Employees.update(emp, {where: { id: id }});

    if (updatedEmployee[0] === 0) {
      return res.status(404).json({ message:"Employee not found" });
    }

    res.status(200).json({ message:"Employee updated successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



//search for a emp
router.get("/search/:code", async (req, res) => {
  const employeeId = req.query.code; 
    const employee = await Employees.findOne({
      where: { employeeId: employeeId } 
    });
    res.json({
      name: employee.name,
      employeeId: employee.employeeId,
      email:employee.email,
      phoneNumber:employee.phoneNumber,
      department:employee.department,
      role:employee.role
    });
});

module.exports = router;

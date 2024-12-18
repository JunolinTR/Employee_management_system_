const express = require("express");
const router = express.Router();
const { Employees } = require("../models");
const { Op } = require("sequelize");

// Get all employees
router.get("/", async (req, res) => {
  try {
    const listOfEmp = await Employees.findAll();
    res.json(listOfEmp);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Search employees based on a search term
router.get("/search", async (req, res) => {
  const searchTerm = req.query.search || ""; // Get search term from query params

  try {
    const employees = await Employees.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { employeeId: { [Op.like]: `%${searchTerm}%` } },
          { email: { [Op.like]: `%${searchTerm}%` } },
          { department: { [Op.like]: `%${searchTerm}%` } },
          { role: { [Op.like]: `%${searchTerm}%` } },
          { phoneNumber: { [Op.like]: `%${searchTerm}%` } }
        ]
      }
    });

    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add a new employee
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

// Delete an employee by ID
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

router.put('/employee/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const employee = await Employees.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update employee details
    await employee.update(updatedData);
    res.status(200).json({ message: 'Employee updated successfully', data: employee });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

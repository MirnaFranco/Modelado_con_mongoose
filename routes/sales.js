const express = require('express');
const Sale = require('../models/Sale'); // Importar el modelo Sale
const Employee = require('../models/employee'); // Importar el modelo Employee
const router = express.Router();

// Middleware para verificar que el usuario está autenticado
const authMiddleware = require('../middleware/auth'); // Suponiendo que tienes un middleware de autenticación

// Crear una nueva venta
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { date, product, quantity, amount } = req.body;

    // Crear una nueva venta
    const newSale = new Sale({
      date,
      product,
      quantity,
      amount,
      employee: req.user.id // Asignar el ID del empleado autenticado
    });

    // Guardar la venta en la base de datos
    const savedSale = await newSale.save();

    // Agregar la venta al empleado
    await Employee.findByIdAndUpdate(req.user.id, {
      $push: { sales: savedSale._id }
    });

    res.status(201).json(savedSale);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la venta', error });
  }
});

// Obtener todas las ventas de un empleado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sales = await Sale.find({ employee: req.user.id });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ventas', error });
  }
});

// Eliminar una venta por ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const saleId = req.params.id;

    // Verificar que la venta pertenece al empleado autenticado
    const sale = await Sale.findOne({ _id: saleId, employee: req.user.id });
    if (!sale) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    // Eliminar la venta
    await Sale.findByIdAndDelete(saleId);

    // Eliminar la venta del empleado
    await Employee.findByIdAndUpdate(req.user.id, {
      $pull: { sales: saleId }
    });

    res.status(204).send(); // Respuesta vacía para indicar éxito
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la venta', error });
  }
});

module.exports = router;

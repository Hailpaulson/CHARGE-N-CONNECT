import Vehicle from '../models/Vehicle.js';

export const addVehicle = async (req, res) => {
  try {
    const { make, model, year, licensePlate, chargerType } = req.body;
    const vehicle = new Vehicle({
      owner: req.user._id,
      make,
      model,
      year,
      licensePlate,
      chargerType
    });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ message: 'Error adding vehicle' });
  }
};

export const getUserVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id });
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
}; 
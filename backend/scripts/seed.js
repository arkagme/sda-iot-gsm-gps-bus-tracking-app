const mongoose = require('mongoose');
const Route = require('../models/Route');
const Bus = require('../models/Bus');
require('dotenv').config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Route.deleteMany({});
    await Bus.deleteMany({});

    const route = await Route.create({
      routeName: "Main Campus Route",
      routeNumber: "R001",
      stops: [
        {
          name: "Main Gate",
          location: { type: "Point", coordinates: [79.016572, 10.730447] },
          order: 1,
          estimatedArrivalTime: "08:00"
        },
        {
          name: "Academic Block",
          location: { type: "Point", coordinates: [79.0201, 10.728058] },
          order: 2,
          estimatedArrivalTime: "08:05"
        }
      ],
      startTime: "08:00",
      endTime: "18:00",
      daysOperating: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      isActive: true
    });

    // Create bus
    await Bus.create({
      busNumber: "TN38-001",
      deviceId: "TRACKER_001",
      route: route._id,
      driver: {
        name: "Arka 1",
        phone: "9626993911"
      },
      capacity: 50,
      registrationNumber: "TN38AB1234",
      status: "active"
    });

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
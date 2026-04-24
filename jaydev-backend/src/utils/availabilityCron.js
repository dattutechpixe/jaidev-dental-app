const cron = require("node-cron");
const Services = require("../models/resourceSchema");
const Equipment = require("../models/equipmentSchema");

// console.log("⏳ Availability Cron Loaded");

// Runs every hour to update status and clean old bookings
cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();

    // ==================================================================
    // 1. CLEANUP EXPIRED BOOKINGS (Remove dates that have passed)
    // ==================================================================
    // Remove from bookedDates where 'end' is less than now
    await Services.updateMany(
      {},
      { $pull: { bookedDates: { end: { $lt: now } } } }
    );
    await Equipment.updateMany(
      {},
      { $pull: { bookedDates: { end: { $lt: now } } } }
    );

    // ==================================================================
    // 2. UPDATE STATUS BASED ON CURRENT BOOKINGS
    // ==================================================================

    // A. Set STATUS = 'booked' if there is an active booking now
    const activeFilter = {
      bookedDates: {
        $elemMatch: { start: { $lte: now }, end: { $gte: now } },
      },
    };

    await Services.updateMany(activeFilter, { $set: { status: "booked" } });
    await Equipment.updateMany(activeFilter, { $set: { status: "booked" } });

    // B. Set STATUS = 'available' if NO active booking now
    // We find items where bookedDates does NOT contain a current booking
    const availableFilter = {
      bookedDates: {
        $not: {
          $elemMatch: { start: { $lte: now }, end: { $gte: now } },
        },
      },
    };

    await Services.updateMany(availableFilter, { $set: { status: "available" } });
    await Equipment.updateMany(availableFilter, { $set: { status: "available" } });

    // console.log("✔ Availability auto-reset & cleanup completed at:", new Date());
  } catch (err) {
    console.error("❌ Cron Error:", err);
  }
});

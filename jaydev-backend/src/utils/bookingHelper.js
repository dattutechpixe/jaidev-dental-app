const Equipment = require("../models/equipmentSchema");
const Services = require("../models/resourceSchema");
const razorpay = require("./razorpay");

/**
 * Find available equipment item IDs for a subcategory within a date range
 */
exports.getAvailableEquipmentIds = async (
  subCategory,
  startDate,
  endDate,
  quantityRequested,
) => {
  const allItems = await Equipment.find({ subCategory, approvedByAdmin: true });
  const availableIds = [];

  const reqStart = new Date(startDate).getTime();
  const reqEnd = new Date(endDate).getTime();

  for (const item of allItems) {
    let isBooked = false;
    if (item.bookedDates && item.bookedDates.length > 0) {
      isBooked = item.bookedDates.some((booking) => {
        const bookedStart = new Date(booking.start).getTime();
        const bookedEnd = new Date(booking.end).getTime();
        return reqStart < bookedEnd && reqEnd > bookedStart;
      });
    }

    if (!isBooked) {
      availableIds.push(item._id);
    }

    if (availableIds.length >= quantityRequested) {
      break;
    }
  }

  return availableIds.length >= quantityRequested ? availableIds : null;
};

/**
 * Get count of available units in a subcategory
 */
exports.getAvailableCount = async (subCategory, startDate, endDate) => {
  const allItems = await Equipment.find({ subCategory, approvedByAdmin: true });

  // Default to current time if no dates provided
  const reqStart = startDate ? new Date(startDate).getTime() : Date.now();

  // OLD LOGIC (COMMENTED OUT): 1 hour window check
  // const reqEnd = endDate ? new Date(endDate).getTime() : reqStart + (60 * 60 * 1000);

  // NEW LOGIC: 24 hour window check (Provides more realistic availability for users)
  const reqEnd = endDate
    ? new Date(endDate).getTime()
    : reqStart + 24 * 60 * 60 * 1000;

  let availableCount = 0;
  for (const item of allItems) {
    let isBooked = false;
    if (item.bookedDates && item.bookedDates.length > 0) {
      isBooked = item.bookedDates.some((booking) => {
        const bookedStart = new Date(booking.start).getTime();
        const bookedEnd = new Date(booking.end).getTime();
        return reqStart < bookedEnd && reqEnd > bookedStart;
      });
    }
    if (!isBooked) availableCount++;
  }
  return availableCount;
};

/**
 * Handle date blocking for equipment/services
 */
exports.blockDates = async (products, bookingId) => {
  const now = new Date();
  for (const item of products) {
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    const productId = item.productId;
    const modelType = item.modelType;

    const Model = modelType === "equipment" ? Equipment : Services;
    const productDoc = await Model.findById(productId);

    if (productDoc) {
      if (!productDoc.bookedDates) productDoc.bookedDates = [];
      productDoc.bookedDates.push({
        start: startDate,
        end: endDate,
        bookingId: bookingId,
      });

      // Update status if currently within the rental period
      if (modelType === "services") {
        productDoc.status = "booked";
      } else if (startDate <= now && endDate >= now) {
        productDoc.status = "booked";
      }
      await productDoc.save();
    }
  }
};

/**
 * Handle date unblocking (Manual Admin Action or post-cancellation check)
 */
exports.unblockDates = async (products, bookingId, targetProductId = null) => {
  for (const item of products) {
    const productId = item.productId;

    // If a specific targetProductId is provided, skip others
    if (
      targetProductId &&
      productId.toString() !== targetProductId.toString()
    ) {
      continue;
    }
    const modelType = item.modelType;
    const Model = modelType === "equipment" ? Equipment : Services;

    await Model.findByIdAndUpdate(productId, {
      $pull: {
        bookedDates: { bookingId: bookingId },
      },
    });

    // Check if status should be reset to 'available'
    const productDoc = await Model.findById(productId);
    if (productDoc && productDoc.status === "booked") {
      if (modelType === "services") {
        // Services: only go back to available when bookedDates is fully empty (admin unblocked all)
        if (!productDoc.bookedDates || productDoc.bookedDates.length === 0) {
          productDoc.status = "available";
          await productDoc.save();
        }
      } else {
        const now = new Date();
        if (productDoc.bookedDates && productDoc.bookedDates.length > 0) {
          const hasActiveBooking = productDoc.bookedDates.some(
            (b) => b.start <= now && b.end >= now,
          );
          if (!hasActiveBooking) {
            productDoc.status = "available";
            await productDoc.save();
          }
        } else {
          productDoc.status = "available";
          await productDoc.save();
        }
      }
    }
  }
};

/**
 * Handle Razorpay Refund
 */
exports.processOnlineRefund = async (
  paymentId,
  amountInPaise,
  speed = "normal",
) => {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amountInPaise,
      speed: speed,
    });
    return refund;
  } catch (error) {
    console.error("Razorpay Refund Error:", error);
    throw error;
  }
};

/**
 * Calculate total security deposit for a booking
 */
exports.calculateTotalDeposit = (products) => {
  let totalDeposit = 0;
  for (const product of products) {
    if (product.modelType === "equipment") {
      totalDeposit += product.securityDeposit || 0;
    }
  }
  return totalDeposit;
};

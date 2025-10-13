const mongoose = require("mongoose");

// Sub-schemas for organization
const OpeningHoursSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      required: true,
    },
    isOpen: { type: Boolean, default: true },
    openTime: {
      type: String,
      required: function () {
        return this.isOpen;
      },
    },
    closeTime: {
      type: String,
      required: function () {
        return this.isOpen;
      },
    },
    breakTime: {
      start: String,
      end: String,
    },
  },
  { _id: false }
);

const ServiceTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  price: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
});

const TimeSlotSchema = new mongoose.Schema({
  StartTime: { type: String, required: true },
  duration: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

const SettingSchema = new mongoose.Schema({
  // General Settings
  appName: { type: String, default: "My Portfolio" },
  appDescription: String,
  companyName: String,
  contactEmail: String,
  phoneNumber: String,
  address: String,

  // Opening Hours
  openingHours: [OpeningHoursSchema],

  // Service Types
  serviceTypes: [ServiceTypeSchema],

  // Business Settings
  TimeSlots: [TimeSlotSchema],

  // System
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const generateTimeSlotsWithBreak = (
  openTime,
  closeTime,
  breakStart,
  breakEnd,
  duration = 60
) => {
  const slots = [];

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const startMinutes = timeToMinutes(openTime);
  const endMinutes = timeToMinutes(closeTime);
  const breakStartMinutes = timeToMinutes(breakStart);
  const breakEndMinutes = timeToMinutes(breakEnd);

  for (let current = startMinutes; current < endMinutes; current += duration) {
    // Skip break time slots
    if (current >= breakStartMinutes && current < breakEndMinutes) {
      continue;
    }

    if (current + duration <= endMinutes) {
      slots.push({
        StartTime: minutesToTime(current),
        duration: duration,
        isActive: true,
      });
    }
  }

  return slots;
};
// Singleton pattern - only one settings document
SettingSchema.statics.getSingle = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = new this();
    // Initialize defaults
    settings.openingHours = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
    ].map((day) => ({
      day,
      isOpen: true,
      openTime: "09:00",
      closeTime: "17:00",
      breakTime: { start: "12:00", end: "13:00" },
    }));

    const firstOpenDay = settings.openingHours.find((day) => day.isOpen);
    if (firstOpenDay) {
      settings.TimeSlots = generateTimeSlotsWithBreak(
        firstOpenDay.openTime,
        firstOpenDay.closeTime,
        firstOpenDay.breakTime.start, 
        firstOpenDay.breakTime.end, 
        60
      );
    } else {
      // Fallback if no open days
      settings.TimeSlots = generateTimeSlotsWithBreak("09:00", "17:00", 60);
    }

    await settings.save();
  }
  return settings;
};

// Update the updatedAt field before saving
SettingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const SettingModel = mongoose.model("Setting", SettingSchema);

module.exports = SettingModel;

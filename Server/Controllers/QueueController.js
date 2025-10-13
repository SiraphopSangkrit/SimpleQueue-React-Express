const QueueModel = require("../Models/Queue");
const CustomerModel = require("../Models/Customer");
const SettingModel = require("../Models/Settings");
class QueueController {
  // Get all queues
  async getAllQueues(req, res) {
    try {
      const queues = await QueueModel.find()
        .populate("customerId")
        .sort({ bookingDate: 1, queueNumber: 1 });

      const settings = await SettingModel.getSingle();

      // Add time slot details to each queue
      const queuesWithSettings = queues.map((queue) => {
        const timeSlotDetails = settings.TimeSlots.id(queue.timeSlot);
        const serviceTypeDetails = settings.serviceTypes.id(
          queue.serviceTypeId
        );
        return {
          ...queue.toObject(),
          timeSlotDetails: timeSlotDetails || null,
          serviceTypeDetails: serviceTypeDetails || null,
        };
      });

      res.status(200).json({
        success: true,
        data: queuesWithSettings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching queues",
        error: error.message,
      });
    }
  }

  // Get queue by ID
  async getQueueById(req, res) {
    try {
      const { id } = req.params;
      const queue = await QueueModel.findById(id).populate("customerId");

      if (!queue) {
        return res.status(404).json({
          success: false,
          message: "Queue not found",
        });
      }
      const settings = await SettingModel.getSingle();
      const timeSlotDetails = settings.TimeSlots.id(queue.timeSlot);

      // Add time slot details to the response
      const queueWithTimeSlot = {
        ...queue.toObject(),
        timeSlotDetails: timeSlotDetails || null,
      };

      res.status(200).json({
        success: true,
        data: queueWithTimeSlot,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching queue",
        error: error.message,
      });
    }
  }

  // Create new queue
  async createQueue(req, res) {
    try {
      const {
        customerName,
        customerPhone,
        customerLineId,
        serviceTypeId,
        bookingDate,
        timeSlot,
        notes,
      } = req.body;

      if (!serviceTypeId) {
        return res.status(400).json({
          success: false,
          message: "serviceTypeId is required",
        });
      }

      // Generate global queue ID
      const lastQueue = await QueueModel.findOne().sort({ queueId: -1 });
      const queueId = lastQueue ? lastQueue.queueId + 1 : 1;

      // Generate queue number for the specific date
      const bookingDateObj = new Date(bookingDate);
      const startOfDay = new Date(bookingDateObj);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(bookingDateObj);
      endOfDay.setHours(23, 59, 59, 999);

      const lastQueueForDate = await QueueModel.findOne({
        bookingDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }).sort({ queueNumber: -1 });

      const queueNumber =
        lastQueueForDate && lastQueueForDate.queueNumber
          ? lastQueueForDate.queueNumber + 1
          : 1;

      const checkCustomer = await CustomerModel.findOne({ customerPhone });
      let customerObject;
      if (checkCustomer) {
        customerObject = checkCustomer;
      } else {
        const newCustomer = new CustomerModel({
          customerName,
          customerPhone,
          customerLineId,
        });
        customerObject = await newCustomer.save();
      }
      const newQueue = new QueueModel({
        queueId,
        queueNumber,
        customerId: customerObject._id,
        serviceTypeId: serviceTypeId,
        bookingDate,
        timeSlot,
        notes: notes || "",
      });

      const savedQueue = await newQueue.save();

      res.status(201).json({
        success: true,
        message: "Queue created successfully",
        data: savedQueue,
        customer: customerObject,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating queue",
        error: error.message,
      });
    }
  }

  // Update queue
  async updateQueue(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedQueue = await QueueModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedQueue) {
        return res.status(404).json({
          success: false,
          message: "Queue not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Queue updated successfully",
        data: updatedQueue,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating queue",
        error: error.message,
      });
    }
  }

  // Delete queue
  async deleteQueue(req, res) {
    try {
      const { id } = req.params;
      const deletedQueue = await QueueModel.findByIdAndDelete(id);

      if (!deletedQueue) {
        return res.status(404).json({
          success: false,
          message: "Queue not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Queue deleted successfully",
        data: deletedQueue,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting queue",
        error: error.message,
      });
    }
  }

  // Update queue status
  async updateQueueStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updateData = { status };

      // If status is completed, set completedAt timestamp
      if (status === "completed") {
        updateData.completedAt = new Date();
      }

      const updatedQueue = await QueueModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedQueue) {
        return res.status(404).json({
          success: false,
          message: "Queue not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Queue status updated successfully",
        data: updatedQueue,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating queue status",
        error: error.message,
      });
    }
  }

  async getLatestQueue(req, res) {
    try {
      const latestQueue = await QueueModel.find()
        .sort({ queueId: -1 })
        .populate("customerId")
        .limit(5);

      if (!latestQueue) {
        return res.status(404).json({
          success: false,
          message: "No latest queue found",
        });
      }

      const settings = await SettingModel.getSingle();
   

      const latestQueueWithDetails = latestQueue.map((queue) => ({
        ...queue.toObject(),
        timeSlot: settings.TimeSlots.id(queue.timeSlot),
        serviceType: settings.serviceTypes.id(queue.serviceTypeId),
      }));

      res.status(200).json({
        success: true,
        data: latestQueueWithDetails,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching latest queue",
        error: error.message,
      });
    }
  }

  // Get queues by status
  async getQueuesByStatus(req, res) {
    try {
      const { status } = req.params;
      const queues = await QueueModel.find({ status }).sort({
        bookingDate: 1,
        queueNumber: 1,
      });

      res.status(200).json({
        success: true,
        data: queues,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching queues by status",
        error: error.message,
      });
    }
  }

  // Get today's queues
  async getTodaysQueues(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const queues = await QueueModel.find({
        bookingDate: {
          $gte: today,
          $lt: tomorrow,
        },
      }).sort({ queueNumber: 1 });

      res.status(200).json({
        success: true,
        data: queues,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching today's queues",
        error: error.message,
      });
    }
  }

  // Get queue statistics
  async getQueueStats(req, res) {
    try {
      const totalQueues = await QueueModel.countDocuments();
      const waitingQueues = await QueueModel.countDocuments({
        status: "waiting",
      });
      const inProgressQueues = await QueueModel.countDocuments({
        status: "in-progress",
      });
      const completedQueues = await QueueModel.countDocuments({
        status: "completed",
      });
      const cancelledQueues = await QueueModel.countDocuments({
        status: "cancelled",
      });

      const stats = {
        total: totalQueues,
        waiting: waitingQueues,
        inProgress: inProgressQueues,
        completed: completedQueues,
        cancelled: cancelledQueues,
      };

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching queue statistics",
        error: error.message,
      });
    }
  }

  // Get next queue in line
  async getNextQueue(req, res) {
    try {
      const nextQueue = await QueueModel.findOne({ status: "waiting" }).sort({
        queueId: 1,
      });

      if (!nextQueue) {
        return res.status(404).json({
          success: false,
          message: "No queues waiting",
        });
      }

      res.status(200).json({
        success: true,
        data: nextQueue,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching next queue",
        error: error.message,
      });
    }
  }

  // Get queues by weekend
  async getQueuesByWeekend(req, res) {
    try {
      const { startDate, endDate } = req.query;

      let query = {};

      if (startDate && endDate) {
        // If specific date range is provided
        query.bookingDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else {
        // Get current weekend (Saturday and Sunday)
        const today = new Date();
        const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Calculate days until Saturday
        const daysUntilSaturday = (6 - currentDay + 7) % 7;
        const saturday = new Date(today);
        saturday.setDate(today.getDate() + daysUntilSaturday);
        saturday.setHours(0, 0, 0, 0);

        // Calculate Sunday (next day after Saturday)
        const sunday = new Date(saturday);
        sunday.setDate(saturday.getDate() + 1);

        // End of Sunday
        const endOfSunday = new Date(sunday);
        endOfSunday.setHours(23, 59, 59, 999);

        query.bookingDate = {
          $gte: saturday,
          $lte: endOfSunday,
        };
      }

      const queues = await QueueModel.find(query)
        .populate("customerId")
        .sort({ bookingDate: 1, queueNumber: 1 });

      res.status(200).json({
        success: true,
        data: queues,
        count: queues.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching weekend queues",
        error: error.message,
      });
    }
  }

  // Get queues for specific week's weekend
  async getQueuesForWeekend(req, res) {
    try {
      const { week, year } = req.params;

      // Calculate the Saturday and Sunday of the specified week
      const firstDayOfYear = new Date(year, 0, 1);
      const daysToAdd = (week - 1) * 7;
      const targetDate = new Date(
        firstDayOfYear.getTime() + daysToAdd * 24 * 60 * 60 * 1000
      );

      // Find Saturday of that week
      const dayOfWeek = targetDate.getDay();
      const daysToSaturday = (6 - dayOfWeek + 7) % 7;
      const saturday = new Date(targetDate);
      saturday.setDate(targetDate.getDate() + daysToSaturday);
      saturday.setHours(0, 0, 0, 0);

      // Sunday is the next day
      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1);

      const endOfSunday = new Date(sunday);
      endOfSunday.setHours(23, 59, 59, 999);

      const queues = await QueueModel.find({
        bookingDate: {
          $gte: saturday,
          $lte: endOfSunday,
        },
      })
        .populate("customerId")
        .sort({ bookingDate: 1, queueNumber: 1 });

      res.status(200).json({
        success: true,
        data: queues,
        weekend: {
          saturday: saturday.toISOString().split("T")[0],
          sunday: sunday.toISOString().split("T")[0],
        },
        count: queues.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching weekend queues",
        error: error.message,
      });
    }
  }

  // Get queues by week
  async getQueuesByWeek(req, res) {
    try {
      const { startDate, endDate, week, year } = req.query;

      let query = {};

      if (startDate && endDate) {
        // If specific date range is provided
        query.bookingDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else if (week && year) {
        // Calculate the start and end of the specified week
        const firstDayOfYear = new Date(year, 0, 1);
        const daysToAdd = (week - 1) * 7;

        // Find Monday of that week (start of week)
        const targetDate = new Date(
          firstDayOfYear.getTime() + daysToAdd * 24 * 60 * 60 * 1000
        );
        const dayOfWeek = targetDate.getDay();
        const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 0 = Sunday, 1 = Monday

        const monday = new Date(targetDate);
        monday.setDate(targetDate.getDate() + daysToMonday);
        monday.setHours(0, 0, 0, 0);

        // Sunday is the end of week
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        query.bookingDate = {
          $gte: monday,
          $lte: sunday,
        };
      } else {
        // Get current week (Monday to Sunday)
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

        const monday = new Date(today);
        monday.setDate(today.getDate() + daysToMonday);
        monday.setHours(0, 0, 0, 0);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        query.bookingDate = {
          $gte: monday,
          $lte: sunday,
        };
      }

      const queues = await QueueModel.find(query)
        .populate("customerId")
        .sort({ bookingDate: 1, queueNumber: 1 });

      res.status(200).json({
        success: true,
        data: queues,
        count: queues.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching weekly queues",
        error: error.message,
      });
    }
  }

  // Get queues for specific week number
  async getQueuesByWeekNumber(req, res) {
    try {
      const { week, year } = req.params;

      // Calculate the Monday and Sunday of the specified week
      const jan4 = new Date(year, 0, 4); // January 4th is always in week 1
      const weekStart = new Date(jan4);
      weekStart.setDate(jan4.getDate() - jan4.getDay() + 1 + (week - 1) * 7); // Monday
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // Sunday
      weekEnd.setHours(23, 59, 59, 999);

      const queues = await QueueModel.find({
        bookingDate: {
          $gte: weekStart,
          $lte: weekEnd,
        },
      })
        .populate("customerId")
        .sort({ bookingDate: 1, queueNumber: 1 });

      res.status(200).json({
        success: true,
        data: queues,
        week: {
          number: parseInt(week),
          year: parseInt(year),
          startDate: weekStart.toISOString().split("T")[0],
          endDate: weekEnd.toISOString().split("T")[0],
        },
        count: queues.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching weekly queues",
        error: error.message,
      });
    }
  }

  // Get queues by month split by weeks
  async getQueuesByMonthSplitByWeek(req, res) {
    try {
      const { month, year } = req.query;

      // Default to current month/year if not provided
      const targetDate = new Date();
      const targetMonth = month ? parseInt(month) - 1 : targetDate.getMonth(); // Month is 0-indexed
      const targetYear = year ? parseInt(year) : targetDate.getFullYear();

      // Get first and last day of the month
      const firstDayOfMonth = new Date(targetYear, targetMonth, 1);
      const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0);
      lastDayOfMonth.setHours(23, 59, 59, 999);

      // Get all queues for the month
      const queues = await QueueModel.find({
        bookingDate: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      })
        .populate("customerId")
        .sort({ bookingDate: 1, queueNumber: 1 });

      // Helper function to get week number within the month
      const getWeekOfMonth = (date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Adjust for Monday as first day of week
        const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        const dayOfMonth = date.getDate();

        return Math.ceil((dayOfMonth + adjustedFirstDay) / 7);
      };

      // Group queues by week
      const weeklyData = {};

      queues.forEach((queue) => {
        const queueDate = new Date(queue.bookingDate);
        const weekNumber = getWeekOfMonth(queueDate);

        if (!weeklyData[weekNumber]) {
          weeklyData[weekNumber] = {
            week: weekNumber,
            queues: [],
            count: 0,
            weekStart: null,
            weekEnd: null,
          };
        }

        weeklyData[weekNumber].queues.push(queue);
        weeklyData[weekNumber].count++;
      });

      // Calculate week start and end dates for each week
      Object.keys(weeklyData).forEach((weekNum) => {
        const week = parseInt(weekNum);

        // Calculate Monday of this week
        const firstMonday = new Date(targetYear, targetMonth, 1);
        const firstDayOfWeek = firstMonday.getDay();
        const daysToFirstMonday = firstDayOfWeek === 0 ? 1 : 8 - firstDayOfWeek;
        firstMonday.setDate(1 + daysToFirstMonday);

        const weekStart = new Date(firstMonday);
        weekStart.setDate(firstMonday.getDate() + (week - 1) * 7);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        // Make sure we don't go beyond the month
        if (weekStart < firstDayOfMonth) {
          weekStart.setTime(firstDayOfMonth.getTime());
        }
        if (weekEnd > lastDayOfMonth) {
          weekEnd.setTime(lastDayOfMonth.getTime());
        }

        weeklyData[weekNum].weekStart = weekStart.toISOString().split("T")[0];
        weeklyData[weekNum].weekEnd = weekEnd.toISOString().split("T")[0];
      });

      // Convert to array and sort by week number
      const weeksArray = Object.values(weeklyData).sort(
        (a, b) => a.week - b.week
      );

      res.status(200).json({
        success: true,
        data: {
          month: targetMonth + 1, // Convert back to 1-indexed
          year: targetYear,
          monthName: firstDayOfMonth.toLocaleString("default", {
            month: "long",
          }),
          weeks: weeksArray,
          totalQueues: queues.length,
          summary: {
            totalWeeks: weeksArray.length,
            averageQueuesPerWeek:
              Math.round((queues.length / weeksArray.length) * 100) / 100,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching monthly queues by week",
        error: error.message,
      });
    }
  }

  async getQueuesByMonthWithISOWeeks(req, res) {
    try {
      const { month, year } = req.query;

      const targetDate = new Date();
      const targetMonth = month ? parseInt(month) - 1 : targetDate.getMonth();
      const targetYear = year ? parseInt(year) : targetDate.getFullYear();

      const firstDayOfMonth = new Date(targetYear, targetMonth, 1);
      const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0);
      lastDayOfMonth.setHours(23, 59, 59, 999);

      const queues = await QueueModel.find({
        bookingDate: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      })
        .populate("customerId")
        .sort({ bookingDate: 1, queueNumber: 1 });

      // Group by ISO week number
      const weeklyData = {};

      queues.forEach((queue) => {
        const queueDate = new Date(queue.bookingDate);

        // Get ISO week number
        const tempDate = new Date(queueDate.valueOf());
        const dayNum = (queueDate.getDay() + 6) % 7;
        tempDate.setDate(tempDate.getDate() - dayNum + 3);
        const firstThursday = tempDate.valueOf();
        tempDate.setMonth(0, 1);
        if (tempDate.getDay() !== 4) {
          tempDate.setMonth(0, 1 + ((4 - tempDate.getDay() + 7) % 7));
        }
        const weekNumber =
          Math.ceil((firstThursday - tempDate) / 604800000) + 1;

        const weekKey = `${queueDate.getFullYear()}-W${weekNumber}`;

        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {
            weekNumber: weekNumber,
            year: queueDate.getFullYear(),
            queues: [],
            count: 0,
          };
        }

        weeklyData[weekKey].queues.push(queue);
        weeklyData[weekKey].count++;
      });

      const weeksArray = Object.values(weeklyData).sort(
        (a, b) => a.weekNumber - b.weekNumber
      );

      res.status(200).json({
        success: true,
        data: {
          month: targetMonth + 1,
          year: targetYear,
          monthName: firstDayOfMonth.toLocaleString("default", {
            month: "long",
          }),
          weeks: weeksArray,
          totalQueues: queues.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching monthly queues by ISO week",
        error: error.message,
      });
    }
  }

  async createQueueByn8n(req, res) {
    try {
      const {
        customerName,
        customerPhone,
        lineId,
        serviceTypeId,
        bookingDate,
        timeSlot,
        notes,
      } = req.body;

      if (!serviceTypeId) {
        return res.status(400).json({
          success: false,
          message: "serviceTypeId is required",
        });
      }

      const lastQueue = await QueueModel.findOne().sort({ queueId: -1 });
      const queueId = lastQueue ? lastQueue.queueId + 1 : 1;

      const bookingDateObj = new Date(bookingDate);
      const startOfDay = new Date(bookingDateObj);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(bookingDateObj);
      endOfDay.setHours(23, 59, 59, 999);

      const lastQueueForDate = await QueueModel.findOne({
        bookingDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }).sort({ queueNumber: -1 });

      const queueNumber =
        lastQueueForDate && lastQueueForDate.queueNumber
          ? lastQueueForDate.queueNumber + 1
          : 1;

      const checkCustomer = await CustomerModel.findOne({ customerPhone });
      let customerObject;
      if (checkCustomer) {
        customerObject = checkCustomer;
      } else {
        const newCustomer = new CustomerModel({
          customerName,
          customerPhone,
        });
        customerObject = await newCustomer.save();
      }
      const newQueue = new QueueModel({
        queueId,
        queueNumber,
        customerId: customerObject._id,
        serviceTypeId: serviceTypeId,
        bookingDate,
        timeSlot,
        notes: notes || "",
        lineId,
      });

      const savedQueue = await newQueue.save();

      res.status(201).json({
        success: true,
        message: "Queue created successfully",
        data: savedQueue,
        customer: customerObject,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating queue",
        error: error.message,
      });
    }
  }

  async getQueueByLineIdforN8N(req, res) {
    try {
      const { lineId } = req.query;
      const queues = await QueueModel.find({ lineId }).populate("customerId");

      if (!queues || queues.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Queue not found",
        });
      }
      const settings = await SettingModel.getSingle();
      const queuesWithDetails = queues.map((queue) => {
        const timeSlotDetails = settings.TimeSlots.id(queue.timeSlot);
        const serviceTypeDetails = settings.serviceTypes.id(
          queue.serviceTypeId
        );

        return {
          ...queue.toObject(),
          timeSlotDetails: timeSlotDetails || null,
          serviceTypeDetails: serviceTypeDetails || null,
        };
      });

      res.status(200).json({
        success: true,
        data: queuesWithDetails,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching queue",
        error: error.message,
      });
    }
  }

  async notifyStatusChange(req, res) {
    try {
      const { id } = req.params;

      const updatedQueue = await QueueModel.findOne({ _id: id }).populate(
        "customerId"
      );

      if (!updatedQueue) {
        return res.status(404).json({
          success: false,
          message: "Queue not found",
        });
      }

      const settings = await SettingModel.getSingle();

      // Fix: updatedQueue is a single document, not an array
      const timeSlotDetails = settings.TimeSlots.id(updatedQueue.timeSlot);
      const serviceTypeDetails = settings.serviceTypes.id(
        updatedQueue.serviceTypeId
      );

      const queueWithDetails = {
        ...updatedQueue.toObject(),
        timeSlotDetails: timeSlotDetails || null,
        serviceTypeDetails: serviceTypeDetails || null,
      };

      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
      if (!n8nWebhookUrl) {
        return res.status(500).json({
          success: false,
          message: "N8N webhook URL not configured",
        });
      }

      await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: queueWithDetails._id,
          queueId: queueWithDetails.queueId,
          queueNumber: queueWithDetails.queueNumber,
          status: queueWithDetails.status,
          customerId: queueWithDetails.customerId,
          serviceTypeId: queueWithDetails.serviceTypeId,
          bookingDate: queueWithDetails.bookingDate,
          timeSlot: queueWithDetails.timeSlot,
          notes: queueWithDetails.notes,
          lineId: queueWithDetails.lineId,
          timeSlotDetails: queueWithDetails.timeSlotDetails,
          serviceTypeDetails: queueWithDetails.serviceTypeDetails,
        }),
      });

      res.status(200).json({
        success: true,
        message: "Queue status updated and notification sent",
        data: queueWithDetails,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating queue status",
        error: error.message,
      });
    }
  }
}

module.exports = QueueController;

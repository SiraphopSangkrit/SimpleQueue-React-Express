const QueueModel = require("../Models/Queue");
const CustomerModel = require("../Models/Customer");
class QueueController {
  // Get all queues
  async getAllQueues(req, res) {
    try {
      const queues = await QueueModel.find()
        .populate("customerId")
        .sort({ queueNumber: 1 });
      res.status(200).json({
        success: true,
        data: queues,
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

      res.status(200).json({
        success: true,
        data: queue,
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
        serviceType,
        bookingDate,
        timeSlot,
        notes,
      } = req.body;

      // Generate queue number
      const lastQueue = await QueueModel.findOne().sort({ queueNumber: -1 });
      const queueNumber = lastQueue ? lastQueue.queueNumber + 1 : 1;

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
        queueNumber,
        customerId: customerObject._id,
        serviceType,
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

  // Get queues by status
  async getQueuesByStatus(req, res) {
    try {
      const { status } = req.params;
      const queues = await QueueModel.find({ status }).sort({ queueNumber: 1 });

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
        queueNumber: 1,
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
  // async checkCustomerExists(req, res) {
  //   try {
  //     const { customerPhone } = req.body;
  //     const customer = await CustomerModel.findOne({ customerPhone });
  //     if (customer) {
  //       return res.status(200).json({
  //         success: true,
  //         message: "Customer exists",
  //         data: customer,
  //       });
  //     } else {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Customer not found",
  //       });
  //     }
  //   } catch (err) {
  //     res.status(500).json({
  //       success: false,
  //       message: "Error checking customer existence",
  //       error: err.message,
  //     });
  //   }
  // }
}

module.exports = QueueController;

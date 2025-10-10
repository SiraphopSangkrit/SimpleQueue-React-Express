const SettingModel = require("../Models/Settings");

class SettingsController {
  async getSettings(req, res) {
    try {
      const settings = await SettingModel.getSingle();
      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching settings",
        error: error.message,
      });
    }
  }

  async updateSettings(req, res) {
    try {
      const settingsData = req.body;

      // Validate required fields
      if (!settingsData.appName || !settingsData.companyName) {
        return res.status(400).json({
          success: false,
          message: "App name and company name are required",
        });
      }

      let settings = await SettingModel.getSingle();
      if (!settings) {
        settings = new SettingModel();
      }

      // Update settings with provided data
      Object.assign(settings, settingsData);
      await settings.save();

      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating settings",
        error: error.message,
      });
    }
  }

  async createServiceType(req, res) {
    try {
      const { name, isActive, order } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Service type name is required",
        });
      }

      const settings = await SettingModel.getSingle();

      settings.serviceTypes.push({
        name,
        isActive,
        order,
      });

      await settings.save();

      res.status(200).json({
        success: true,
        data: settings.serviceTypes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating service type",
        error: error.message,
      });
    }
  }


  
  async deleteServiceType(req, res) {
    try {
      const { id } = req.params;

   if (!id) {
      return res.status(400).json({
        success: false,
        message: "Service type ID is required",
      });
    }
      const settings = await SettingModel.getSingle();
       
    
    const serviceTypeExists = settings.serviceTypes.some(
      (type) => type._id.toString() === id
    );

    if (!serviceTypeExists) {
      return res.status(404).json({
        success: false,
        message: "Service type not found",
      });
    }

    settings.serviceTypes = settings.serviceTypes.filter(
      (type) => type._id.toString() !== id
    );

    await settings.save();

      res.status(200).json({
        success: true,
        data: settings.serviceTypes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting service type",
        error: error.message,
      });
    }
  }

}
module.exports = SettingsController;

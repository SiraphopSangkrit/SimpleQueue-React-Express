import { Input } from "../../../components/Inputs/Input";
import { useEffect, useState } from "react";
import { getSettings,deleteServiceType,addServiceType } from "../../../api/SettingsAPI";

export function General() {
  const [appName, setappName] = useState<string>("");
  const [serviceTypesList, setServiceTypesList] = useState<any[]>([]);
  const [serviceType, setServiceType] = useState<string>("");

  const [isActive, setIsActive] = useState<boolean>(true);

  

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch settings from the API
        const response = await getSettings();
        console.log("Settings fetched successfully:", response);
        setappName(response.data.appName || "");

        setServiceTypesList(response.data.serviceTypes || "");
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

const handleAddServiceType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newServiceType = { name: serviceType, isActive: true };
      const response = await addServiceType(newServiceType);
      console.log("Service type added successfully:", response);

      setServiceType(""); 

const updatedSettings = await getSettings();
    setServiceTypesList(updatedSettings.data.serviceTypes || []);
    } catch (error) {
      console.error("Error adding service type:", error);
    }
  };


  const handleDeleteServiceType = async (id: string) => {
    try {
      const response = await deleteServiceType(id);
      console.log("Service type deleted successfully:", response);
      // Update the service types list after deletion
      setServiceTypesList((prevList) =>
        prevList.filter((service) => service._id !== id)
      );
    } catch (error) {
      console.error("Error deleting service type:", error);
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold mb-4">General Settings</h1>
      </div>

      <div className="w-full">
        <form className="max-w-3xl flex justify-center items-center mx-auto w-full flex-col gap-3">
          <Input
            boxClassName="flex-2"
            label="App Name"
            value={appName}
            onChange={(value) => setappName(value)}
            placeholder="App Name"
            type="text"
            name="appname"
          />
          <div className="flex justify-end w-full gap-3">
            <button className="btn btn-primary" type="submit">
              Save Changes
            </button>
            <button className="btn btn-error">Clear</button>
          </div>
        </form>

        <form className="max-w-3xl flex justify-center items-center mx-auto w-full flex-col gap-3 mt-3" onSubmit={handleAddServiceType}>
        <div className="w-full">
        
          <input
            className="flex-2 w-full input border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="service type"
            type="text"
            value={serviceType}
               onChange={(e) => setServiceType(e.target.value)}
            name="servicetypes"
            ></input>
           < button className="btn btn-primary mt-3" type="submit">
              Save Changes
            </button>
            </div>
          <div className="rounded-lg p-4 w-full shadow-md bg-base-100 max-h-40 overflow-y-scroll">
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>

                    <th className="text-center">Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
           {serviceTypesList.length > 0 ? (
                    serviceTypesList.map((service, index) => (
                      <tr key={service._id}>
                        <th>{index + 1}</th>
                        <td>{service.name}</td>
                        <td >
                          <div className="flex justify-center gap-2">
                          <span className={`badge ${service.isActive ? 'badge-success' : 'badge-error'}`}>
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-center gap-2">
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                           
                                console.log('Edit service:', service._id);
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-error btn-sm"
                              onClick={() => handleDeleteServiceType(service._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        No service types found. Add one above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

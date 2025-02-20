import api from "./api";

// Fetch all institutions
export const getInstitutions = async () => {
  try {
    const response = await api.get("/institutions");
    return response.data;
  } catch (error) {
    console.error("Error fetching institutions:", error);
    throw error;
  }
};

// Fetch a single institution by ID
export const getInstitutionById = async (id) => {
  try {
    const response = await api.get(`/institutions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching institution:", error);
    throw error;
  }
};

// Search institutions by name
export const searchInstitutions = async (name) => {
  try {
    const response = await api.get(`/institutions/search?name=${name}`);
    return response.data;
  } catch (error) {
    console.error("Error searching institutions:", error);
    throw error;
  }
};

// Create a new institution
export const createInstitution = async (institutionData) => {
  try {
    const response = await api.post("/institutions", institutionData);
    return response.data;
  } catch (error) {
    console.error("Error creating institution:", error);
    throw error;
  }
};

// Update an institution
export const updateInstitution = async (id, updatedData) => {
  try {
    const response = await api.put(`/institutions/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating institution:", error);
    throw error;
  }
};

// Delete an institution
export const deleteInstitution = async (id) => {
  try {
    const response = await api.delete(`/institutions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting institution:", error);
    throw error;
  }
};

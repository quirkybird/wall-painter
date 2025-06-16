const { VITE_BASE_URL: BASE_URL } = import.meta.env;

export const getUnitCost = async () => {
  try {
    const response = await fetch(`${BASE_URL}/unit-cost`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching unit cost:", error);
    return [];
  }
};

export const updateUnitCost = async (id: any, newUnitCost: any) => {
  try {
    const response = await fetch(`${BASE_URL}/unit-cost/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...newUnitCost }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating unit cost:", error);
    throw error;
  }
};

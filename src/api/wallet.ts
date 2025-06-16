const { VITE_BASE_URL: BASE_URL } = import.meta.env;

// 插入数据到工程计算表
export const submitCalcRes = async (insertData: any) => {
  try {
    const response = await fetch(`${BASE_URL}/engineering-calculation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(insertData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("数据插入成功:", data);
    return data;
  } catch (err) {
    console.error("意外错误:", err);
    throw err;
  }
};

// 更新工程计算表中的数据
export const updateCalcRes = async (updateData: any, projectId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/engineering-calculation/${projectId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("数据更新成功:", data);
    return data;
  } catch (err) {
    console.error("意外错误:", err);
    throw err;
  }
};

// 请求计算列表全部数据
export const fetchEngineeringCalculation = async () => {
  try {
    const response = await fetch(`${BASE_URL}/engineering-calculation/list`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("数据获取成功:", data);
    return data;
  } catch (err) {
    console.error("意外错误:", err);
    throw err;
  }
};

// 请求计算列表Project数据
export const fetchEngineeringCalculationForProject = async () => {
  try {
    const response = await fetch(`${BASE_URL}/engineering-calculation/project`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("数据获取成功:", data);
    return data;
  } catch (err) {
    console.error("意外错误:", err);
    throw err;
  }
};

// 根据 projectId 查询工程计算表中的数据
export const fetchCalcResById = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/engineering-calculation/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("根据 ID 获取数据成功:", data);
    return data;
  } catch (err) {
    console.error("意外错误:", err);
    throw err;
  }
};

// 删除工程计算表中的数据
export const deleteCalcRes = async (projectId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/engineering-calculation/delete/${projectId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("数据删除成功:", data);
    return data;
  } catch (err) {
    console.error("意外错误:", err);
    throw err;
  }
};

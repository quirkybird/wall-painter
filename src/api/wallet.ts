import supabase from "@/http/supabase";

// 插入数据到工程计算表
export const submitCalcRes = async (insertData: any) => {
  try {
    const { data, error } = await supabase
      .from("engineering_calculation")
      .insert([{ ...insertData }])
      .select();

    if (error) {
      console.error("插入数据时出错:", error);
      throw error;
    }

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
    const { data, error } = await supabase
      .from("engineering_calculation") // 指定表名
      .update(updateData) // 使用传入的更新数据
      .eq("projectId", projectId) // 根据条件更新，这里假设通过 id 匹配
      .select(); // 返回更新后的数据

    if (error) {
      console.error("更新数据时出错:", error);
      throw error; // 抛出错误以便调用方处理
    }

    console.log("数据更新成功:", data);
    return data; // 返回更新后的数据
  } catch (err) {
    console.error("意外错误:", err);
    throw err; // 抛出意外错误
  }
};

// 请求计算列表全部数据
export const fetchEngineeringCalculation = async () => {
  try {
    const { data: engineering_calculation, error } = await supabase
      .from("engineering_calculation")
      .select("*");

    if (error) {
      console.error("获取数据时出错:", error);
      throw error;
    }

    console.log("数据获取成功:", engineering_calculation);
    return engineering_calculation;
  } catch (err) {
    console.error("意外错误:", err);
    throw err;
  }
};

// 请求计算列表Project数据
export const fetchEngineeringCalculationForProject = async () => {
  try {
    const { data: engineering_calculation, error } = await supabase
      .from("engineering_calculation")
      .select("projectName, projectId");

    if (error) {
      console.error("获取数据时出错:", error);
      throw error;
    }

    console.log("数据获取成功:", engineering_calculation);
    return engineering_calculation;
  } catch (err) {
    console.error("意外错误:", err);
    throw err;
  }
};

// 根据 projectId 查询工程计算表中的数据
export const fetchCalcResById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("engineering_calculation")
      .select("*")
      .eq("projectId", id);

    if (error) {
      console.error("根据 ID 获取数据时出错:", error);
      throw error;
    }

    console.log("根据 ID 获取数据成功:", data);
    return data;
  } catch (err) {
    console.error("意外错误:", err);
    throw err;
  }
};

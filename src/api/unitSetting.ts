import supabase from "@/http/supabase";

export const getUnitCost = async () => {
  let { data: unit_cost, error } = await supabase.from("unit_cost").select("*");
  if (error) {
    console.error("Error fetching unit cost:", error);
    return [];
  }
  return unit_cost;
};

export const updateUnitCost = async (id: any, newUnitCost: any) => {
  await supabase.from("unit_cost").update(newUnitCost).eq("id", id);
};

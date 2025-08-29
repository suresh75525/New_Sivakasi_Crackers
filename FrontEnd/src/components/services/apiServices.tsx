import axioApi  from "../../axioApi/apiServer";

export const getCategories = async () => {
  try {
    const { data } = await axioApi.get("/products/categories");
    return data;
  } catch (error) {
    throw error;
  }
};
export const getProducts = async () => {
  try {
    const { data } = await axioApi.get("/products/getAllProducts");
    return data;
  } catch (error) {
    throw error;
  }
};

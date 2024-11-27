import axiosClient from "../axios";

export async function getAllProducts() {
    try {
        const response = await axiosClient.get("products/getAllProducts");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
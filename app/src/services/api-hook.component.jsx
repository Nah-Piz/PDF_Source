import axios, { formToJSON } from "axios";
import baseURL from "../assets/url";

//axios.defaults.baseURL = baseURL+"/api/"
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// axios.defaults.withCredentials = true;

function UseAPICall() {
    const getRequest = async (path) => {
        console.log("api called")
        try {
          const response = await axios.get(path);
            console.log("Response",response)
          return { success: true, data: response.data }; 
        } catch (error) {
          console.log("spot 1",error)
          return { success: false, error };
        }
    }
    const postRequest = async (path,data) => {
        try {
            const response = await axios.post(path,data);
            return {success: true, data: response.data}
        } catch (error) {
            return {success: false, error}
        }
    }
    const uploadFile = async (path, formData) => {
      try {
        const response = await axios.post(path, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          error,
        };
      }
    };
    return {
        getRequest,
        postRequest,
        uploadFile
    };
}

export default UseAPICall;

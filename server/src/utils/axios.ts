import axios from "axios";
import appAssert from "./appAssert";
import catchError from "./catchError";

const get = async (url: string) => {
  const response = await axios.get(url, {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "identity",
    },
  });

  return response.data;
};

export default { get };

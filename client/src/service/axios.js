import axios from "axios";

// error message
//
export const Axios = async (url, payload, type = null, token = null) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  let result;
  if (type === null) {
    await axios
      .post(process.env.REACT_APP_API_URL + url, payload, {
        headers: headers,
      })
      .then((res) => {
        if (res.data.error) {
          console.log("success error");
          console.log(res.data);
          result = res;
        } else {
          console.log("success ");
          console.log(res);
          result = res;
        }
      })
      .catch((e) => {
        console.log("catch error");
        result = e;
        console.log(e);
      });
  } 
//   else {
//     if (type === "get") {
//       await axios
//         .get(Url + url, {
//           headers: headers,
//         })
//         .then((res) => {
//           if (res.data.error) {
//             console.log("success error");
//             console.log(res.data);
//             result = res.data;
//           } else {
//             console.log("success ");
//             console.log(res);
//             result = res;
//           }
//         })
//         .catch((e) => {
//           console.log("catch error");
//           result = e;
//           console.log(e);
//         });
//     }
//   }

  return result;
};

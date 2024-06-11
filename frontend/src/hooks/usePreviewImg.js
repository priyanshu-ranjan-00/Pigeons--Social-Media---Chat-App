import React, { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null);

  const showToast = useShowToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader(); //FileReader is a built-in browser API that allows us to read the contents of a file as a text string
      // console.log(reader);

      reader.onloadend = () => {
        setImgUrl(reader.result);
        // console.log(reader.result); console.log(imgUrl);
      };

      reader.readAsDataURL(file);
    } else {
      showToast("Invalid file type", "Please select an image file", "error");
      setImgUrl(null);
    }
  };
  // console.log(imgUrl);
  return { handleImageChange, imgUrl, setImgUrl }; // returning an object with the two properties
};

export default usePreviewImg;

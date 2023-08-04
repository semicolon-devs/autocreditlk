const {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const { storage } = require("../config/firebase.config");

exports.uploadFileToFirebaseStorage = async (fileType, customerID, file) => {
  const fileRef = ref(
    storage,
    `documents/${customerID}/${fileType + "-" + file.originalname}`
  );

  const metadata = {
    contentType: file.mimetype,
  };

  try {
    const snapshot = await uploadBytesResumable(fileRef, file.buffer, metadata);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (err) {
    console.log(err);
    return null;
  }
};

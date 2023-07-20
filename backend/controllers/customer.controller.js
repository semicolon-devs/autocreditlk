const Customer = require("../models/customer.model");
const {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const { firebaseApp, storage } = require("../config/firebase.config");

const uploadFileToFirebaseStorage = async (customerID, file) => {
  // try {
  //   const storageRef = firebaseApp
  //     .storage()
  //     .ref()
  //     .child(`documents/${customerID}/${file.originalname}`);
  //   const snapshot = await storageRef.put(file);
  // } catch (error) {
  //   console.error("Error uploading file:", error);
  //   throw error;
  // }

  const fileRef = ref(storage, `documents/${customerID}/${file.originalname}`);

  const metadata = {
    contentType: file.mimetype,
  };

  uploadBytesResumable(fileRef, file.buffer, metadata)
    .then((snapshot) => {
      console.log("Uploaded a blob or file!");
      getDownloadURL(fileRef)
        .then((url) => {
          console.log(url);
          return url;
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
};

exports.addCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      guarantor,
      guarantorMobile,
      customerID,
      loanAmount,
      noOfInstallments,
      startDate,
      billingCycle,
    } = req.body;

    const application = req.files["application"][0];
    const document1 = req.files["document1"][0];
    const document2 = req.files["document2"][0];

    var applicationLink;
    var document1Link;
    var document2Link;

    // const applicationLink = await uploadFileToFirebaseStorage(
    //   customerID,
    //   application
    // );
    // const document1Link = await uploadFileToFirebaseStorage(
    //   customerID,
    //   document1
    // );
    // const document2Link = await uploadFileToFirebaseStorage(
    //   customerID,
    //   document2
    // );

    const applicationRef = ref(
      storage,
      `documents/${customerID}/${application.originalname}`
    );

    const applicationMetadata = {
      contentType: application.mimetype,
    };

    await uploadBytesResumable(
      applicationRef,
      application.buffer,
      applicationMetadata
    )
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
        getDownloadURL(applicationRef)
          .then(async (url) => {
            console.log(url);
            applicationLink = url;

            const document1Ref = ref(
              storage,
              `documents/${customerID}/${document1.originalname}`
            );

            const document1Metadata = {
              contentType: document1.mimetype,
            };

            await uploadBytesResumable(
              document1Ref,
              document1.buffer,
              document1Metadata
            )
              .then((snapshot) => {
                console.log("Uploaded a blob or file!");
                getDownloadURL(document1Ref)
                  .then(async (url) => {
                    console.log(url);
                    document1Link = url;
                    const document2Ref = ref(
                      storage,
                      `documents/${customerID}/${document2.originalname}`
                    );

                    const document2Metadata = {
                      contentType: document2.mimetype,
                    };

                    await uploadBytesResumable(
                      document2Ref,
                      document2.buffer,
                      document2Metadata
                    )
                      .then((snapshot) => {
                        console.log("Uploaded a blob or file!");
                        getDownloadURL(document2Ref)
                          .then((url) => {
                            console.log(url);
                            document2Link = url;

                            Customer.create({
                              customerID,
                              name,
                              email,
                              phone,
                              address,
                              guarantor,
                              guarantorMobile,
                              loanAmount,
                              paidAmount: 0,
                              noOfInstallments,
                              startDate: new Date(
                                startDate + "T00:00:00+05:30"
                              ),
                              billingCycle,
                              nextBillingDate: new Date(
                                startDate + "T00:00:00+05:30"
                              ),
                              applicationDocumentLink: applicationLink,
                              document1Link: document1Link,
                              document2Link: document2Link,
                            })
                              .then((result) => {
                                // const customers = Customer.findMany({});
                                res.status(200).json({ result: result });
                              })
                              .catch((err) => {
                                res.status(400).json({ message: err.message });
                              });
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => console.log(err));
  } catch (e) {
    console.log("running");
    res.status(400).json({ message: e.message });
  }
};

exports.getCustomers = async (req, res) => {
  Customer.find({})
    .then((result) => {
      res.status(200).json({ customers: result });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

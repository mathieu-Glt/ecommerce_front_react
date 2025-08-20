import React from "react";
import { useState } from "react";
import { validationSchema } from "../../validator/validationRegister";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { auth, db, storage } from "../../config/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { registerOrUpdateUser } from "../../api/auth";

function Register() {
  const dispatch = useDispatch();
  const [isSending, setIsSending] = useState(false);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  console.log("errors: ", errors);
  console.log("watch: ", watch());
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier (images et documents)
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Type de fichier non supporté. Utilisez des images (JPEG, PNG, GIF, WebP) ou des documents (PDF, DOC, DOCX)."
        );
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Le fichier est trop volumineux. Taille maximum : 5MB.");
        return;
      }

      setSelectedFile(file);
      toast.success("Fichier sélectionné avec succès !");
    }
  };

  const onSubmit = async (data) => {
    console.log("Données valides :", data);
    const newUserData = { ...data, picture: selectedFile };
    console.log("newUserData: ", newUserData);
    // Basic cooldown: 60s between attempts
    const lastAt = Number(
      window.localStorage.getItem("lastRegistrationAttemptAt") || 0
    );
    if (Date.now() - lastAt < 60_000) {
      toast.error("Please wait a moment before trying again.");
      return;
    }
    window.localStorage.setItem(
      "lastRegistrationAttemptAt",
      String(Date.now())
    );

    setIsSending(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      dispatch({ type: "REGISTER_START" });

      // Create a safe, serializable user object
      const safeUser = {
        uid: user.uid,
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
        emailVerified: user.emailVerified ?? false,
        providerId:
          (user.providerData && user.providerData[0]?.providerId) || "firebase",
        firstname: data.firstname,
        lastname: data.lastname,
      };

      let fileURL = null;

      // Upload file to Firebase Storage if selected
      if (selectedFile) {
        try {
          setUploadProgress(25);
          const fileExtension = selectedFile.name.split(".").pop();
          const fileName = `users/${user.uid}/profile.${fileExtension}`;
          const storageRef = ref(storage, fileName);

          setUploadProgress(50);
          const uploadResult = await uploadBytes(storageRef, selectedFile);
          setUploadProgress(75);

          fileURL = await getDownloadURL(uploadResult.ref);
          setUploadProgress(100);

          console.log("File uploaded successfully:", fileURL);
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          toast.error(
            "Erreur lors de l'upload du fichier. Le compte sera créé sans fichier."
          );
        }
      }

      // Persist profile in Firestore immediately
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email || data.email,
          firstname: data.firstname,
          lastname: data.lastname,
          fileURL: fileURL, // URL du fichier uploadé
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      console.log("safeUser: ", safeUser);
      await registerOrUpdateUser(safeUser)
        .then((res) => {
          console.log("REGISTER OR UPDATE USER :: ", res);
        })
        .catch((err) => {
          console.log("REGISTER OR UPDATE USER ERROR :: ", err);
        });

      dispatch({ type: "REGISTER_SUCCESS", payload: { user: safeUser } });

      if (fileURL) {
        toast.success(
          `Account created successfully with file upload! Welcome ${data.firstname} ${data.lastname}!`
        );
      } else {
        toast.success(
          `Account created successfully! Welcome ${data.firstname} ${data.lastname}!`
        );
      }

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      dispatch({ type: "REGISTER_ERROR", payload: error });
      toast.error(`Registration failed: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // const onSendMagicLink = async () => {
  //   const formData = watch();
  //   const email = (formData.email || "").trim();
  //   if (!email) {
  //     toast.error("Please enter your email first.");
  //     return;
  //   }
  //   const lastAt = Number(window.localStorage.getItem("lastEmailSentAt") || 0);
  //   if (Date.now() - lastAt < 60_000) {
  //     toast.error("Please wait a moment before requesting another email.");
  //     return;
  //   }

  //   const config = {
  //     handleCodeInApp: true,
  //     url: "http://localhost:3000/login",
  //   };

  //   setIsSendingLink(true);
  //   try {
  //     await sendSignInLinkToEmail(auth, email, config);
  //     window.localStorage.setItem("emailForRegistration", email);
  //     window.localStorage.setItem(
  //       "profileForRegistration",
  //       JSON.stringify({
  //         firstname: formData.firstname || "",
  //         lastname: formData.lastname || "",
  //       })
  //     );
  //     window.localStorage.setItem("lastEmailSentAt", String(Date.now()));
  //     toast.success(
  //       `Check your email ${email}! Click the link to complete your registration.`
  //     );
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.error("Error sending email link:", error);
  //     toast.error("Failed to send magic link. Please try again.");
  //   } finally {
  //     setIsSendingLink(false);
  //   }
  // };

  console.log("Errors fields form: ", errors);

  const registerForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
      <div className="mb-3">
        <label htmlFor="firstname" className="form-label">
          Firstname
        </label>
        <input
          type="text"
          className={`form-control ${errors.firstname ? "is-invalid" : ""}`}
          {...register("firstname")}
          id="firstname"
          placeholder="Enter your first name"
          required
          autoFocus
        />
        {errors.firstname && (
          <div className="invalid-feedback">{errors.firstname.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="lastname" className="form-label">
          Lastname
        </label>
        <input
          type="text"
          className={`form-control ${errors.lastname ? "is-invalid" : ""}`}
          {...register("lastname")}
          id="lastname"
          placeholder="Enter your last name"
          required
        />
        {errors.lastname && (
          <div className="invalid-feedback">{errors.lastname.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          {...register("email")}
          id="email"
          placeholder="Enter your email"
          required
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          {...register("password")}
          id="password"
          placeholder="Enter your password"
          required
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="file" className="form-label">
          Document (optionnel)
        </label>
        <input
          type="file"
          className="form-control"
          id="file"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx"
        />
        <div className="form-text">
          Formats acceptés : Images (JPEG, PNG, GIF, WebP) et Documents (PDF,
          DOC, DOCX). Taille max : 5MB.
        </div>
        {selectedFile && (
          <div className="mt-2">
            <small className="text-success">
              ✓ Fichier sélectionné : {selectedFile.name} (
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </small>
          </div>
        )}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-2">
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
                aria-valuenow={uploadProgress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {uploadProgress}%
              </div>
            </div>
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSending}>
        Register
      </button>
      {/* <button
        type="button"
        className="btn btn-secondary ms-2"
        onClick={onSendMagicLink}
        disabled={isSendingLink}
      >
        Send magic link
      </button> */}
    </form>
  );

  return (
    <div>
      <h1>Register</h1>
      <p>Please fill in the form to create an account.</p>
      <div className="container p-5">
        <div>
          <div className="row">
            <div className="col-md-6 offset-md-3">{registerForm()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

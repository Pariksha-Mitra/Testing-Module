"use client";
import AuthHeader from "@/components/ui/AuthHeader";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Slide from "@mui/material/Slide";
import useFetchSchools from "@/utils/hooks/useFetchSchools";
import { ROLE } from "@/utils/types";
import { TransitionProps } from "@mui/material/transitions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Register = () => {
  const [role, setRole] = useState<ROLE>(ROLE.Student);
  const [firstName, setFirstName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [rollNo, setRollNo] = useState<number>();
  const [division, setDivision] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [schoolId, setSchoolId] = useState<string>("");
  const [invitationId, setInvitationId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();
  const { schools, isLoading } = useFetchSchools();
  const router = useRouter();

  useEffect(() => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 10);
    const formattedDate = today.toISOString().split("T")[0];
    setDateOfBirth(formattedDate);
  }, []);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstName.trim() || !surname.trim() || !dateOfBirth) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (role === ROLE.Teacher && (!email.trim() || !invitationId.trim())) {
      showToast("Teachers must provide email and invitation code", "error");
      return;
    }

    try {
      const requestBody = {
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        surname: surname.trim(),
        dateOfBirth: new Date(dateOfBirth).toISOString().split("T")[0],
        role,
        schoolId,
        rollNo,
        division,
        email: role === ROLE.Teacher ? email.trim() : null,
        invitationId: role === ROLE.Teacher ? invitationId.trim() : null,
      };

      console.log(schoolId);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        setUsername(data.user.username); // Assuming the server returns the username
        setOpen(true); // Show the dialog
        showToast(data.message, "success");
      } else {
        showToast(data.message || "Registration failed", "error");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message || "An error occurred", "error");
      } else {
        showToast("An unknown error occurred", "error");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col w-full h-screen  bg-gradient-to-b from-yellow-50 via-white to-blue-300 overflow-auto">
        <div className="relative h-[25%]">
          <AuthHeader />
        </div>
        <div className="mt-10 w-full flex justify-center items-center flex-col">
          <form
            onSubmit={handleSubmit}
            className="bg-white bg-opacity-60 border border-black shadow-lg rounded-2xl p-8 w-11/12 max-w-4xl"
          >
            <h2 className="text-4xl font-bold text-center mb-8 laila-semibold">
              नोंदणी करा
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Form Fields */}
              <div className="flex flex-col">
                <label htmlFor="firstName" className="text-xl font-light mb-2">
                  पहिले नाव
                </label>
                <input
                  id="firstName"
                  className="p-3 border border-black shadow-md rounded-2xl"
                  type="text"
                  placeholder="First Name Here"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="middleName" className="text-xl font-light mb-2">
                  मधले नाव
                </label>
                <input
                  id="middleName"
                  className="p-3 border border-black shadow-md rounded-2xl"
                  type="text"
                  placeholder="Middle Name Here"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="surname" className="text-xl font-light mb-2">
                  आडनाव
                </label>
                <input
                  id="surname"
                  className="p-3 border border-black shadow-md rounded-2xl"
                  type="text"
                  placeholder="Surname Here"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="dateOfBirth"
                  className="text-xl font-light mb-2"
                >
                  जन्मतारीख
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  className="p-3 border border-black shadow-md rounded-2xl"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Role Selection */}
              <div className="flex flex-col">
                <label htmlFor="role" className="text-xl font-light mb-2">
                  भूमिका
                </label>
                <div id="role" className="flex">
                  <button
                    type="button"
                    onClick={() => setRole(ROLE.Teacher)}
                    className={`flex-1 linear duration-300 p-3 border border-black shadow-md rounded-l-xl ${
                      role === ROLE.Teacher && "bg-red-400 text-white"
                    }`}
                  >
                    शिक्षक
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(ROLE.Student)}
                    className={`flex-1 linear duration-300 p-3 border border-black shadow-md rounded-r-xl ${
                      role === ROLE.Student && "bg-red-400 text-white"
                    } `}
                  >
                    विद्यार्थी
                  </button>
                </div>
              </div>

              {/* School Name */}
              <div className="flex flex-col">
                <label htmlFor="school" className="text-xl font-light mb-2">
                  शाळेचे नाव
                </label>
                <select
                  id="school"
                  value={schoolId}
                  onChange={(e) => {
                    setSchoolId(e.target.value);
                  }}
                  className="p-3 border border-black shadow-md rounded-2xl"
                >
                  <option value="" disabled>
                    Select a school
                  </option>
                  {!isLoading &&
                    schools.map((school) => {
                      return (
                        <option
                          key={school.id as string}
                          value={school.id as string}
                        >
                          {school.name}
                        </option>
                      );
                    })}
                </select>
              </div>
              {role == "student" && (
                <>
                  <div className="flex flex-col">
                    <label htmlFor="rollNo" className="text-xl font-light mb-2">
                      रोल नंबर
                    </label>
                    <input
                      id="rollNo"
                      className="p-3 border border-black shadow-md rounded-2xl"
                      type="number"
                      placeholder="Roll No"
                      value={rollNo}
                      onChange={(e) => setRollNo(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="division"
                      className="text-xl font-light mb-2"
                    >
                      विभाजन
                    </label>
                    <input
                      id="division"
                      className="p-3 border border-black shadow-md rounded-2xl"
                      type="text"
                      placeholder="Division"
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Teacher-specific Fields */}
              {role === ROLE.Teacher && (
                <>
                  <div className="flex flex-col">
                    <label
                      htmlFor="teacherEmail"
                      className="text-xl font-light mb-2"
                    >
                      ई-मेल
                    </label>
                    <input
                      id="teacherEmail"
                      type="email"
                      className="p-3 border border-black shadow-md rounded-2xl"
                      placeholder="abc123@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="invitationCode"
                      className="text-xl font-light mb-2"
                    >
                      आमंत्रण कोड
                    </label>
                    <input
                      id="invitationCode"
                      type="text"
                      className="p-3 border border-black shadow-md rounded-2xl"
                      placeholder="XYZ-123-ABC"
                      value={invitationId}
                      onChange={(e) => setInvitationId(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="py-2 px-12 bg-red-400 text-white text-2xl font-medium rounded-2xl shadow-md hover:bg-red-500 transition-colors"
              >
                पुढील
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center w-11/12 max-w-4xl mt-4">
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              लॉग इन करा
            </Link>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "20px",
            backgroundColor: "white", // Adjust according to your theme
            color: "black", // Text color
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            padding: "16px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "red", // Adjust according to your theme
          }}
        >
          {"नोंदणी यशस्वी"}
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
            fontSize: "1.1rem",
            color: "black", // Adjust according to your theme
          }}
        >
          <DialogContentText id="alert-dialog-slide-description">
            तुमचे वापरकर्ता नाव: <b>{username}</b> <br />
            तुमचे वापरकर्तानाव हा तुमचा पासवर्ड आहे परंतु तुम्ही लॉग इन
            केल्यानंतर बदलू शकता.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <button
            onClick={() => router.push("/login")}
            className="py-2 px-12 bg-red-400 text-white text-2xl font-medium rounded-2xl shadow-md hover:bg-red-500 transition-colors"
          >
            लॉग इन
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Register;

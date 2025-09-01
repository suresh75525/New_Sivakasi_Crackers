import React, { useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useRouter } from "next/navigation";
import { verifyOtp } from "@/components/services/apiServices";
import { placeOrder } from "@/components/services/apiServices";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface OtpPopupProps {
  open: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
  payload: {
    session_id: string;
    name: string;
    mobile_number: string;
    address_line1: string;
    address_line2: string;
    city: string;
    pincode: string;
    landmark: string;
  };
}
const OTP_LENGTH = 6;

const OtpPopup: React.FC<OtpPopupProps> = ({
  open,
  onClose,
  onOrderSuccess,
  payload,
}) => {
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [otpVerified, setOtpVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpDigits.join(""); // collect entered digits

    try {
      const response = await verifyOtp(payload.mobile_number, otp);
      console.log("OTP verify response:", response);

      if (response.success) {
        // ✅ mark verified
        setOtpVerified(true);
        toast.success("OTP verified successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      } else {
        // ❌ backend responded but OTP invalid
        toast.error("Invalid OTP!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        setOtpDigits(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      // ❌ network/server error
      console.error("OTP verification failed:", error);
      toast.error(
        error?.response?.data?.message || "Failed to verify OTP. Try again.",
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        }
      );
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

const router = useRouter();
//   const handleProceedOrder = () => {
//     setOtpDigits(Array(OTP_LENGTH).fill(""));
//     setOtpVerified(false);
//     onClose();
//     onOrderSuccess();
//   };
const handleProceedOrder = async () => {
  setOtpDigits(Array(OTP_LENGTH).fill(""));
  setOtpVerified(false);
  onClose();

  try {
    const result = await placeOrder(payload);
    if (result.message === "Order placed successfully") {
      toast.success(result.message);
      onOrderSuccess();
      sessionStorage.removeItem("session_id");
      localStorage.removeItem("cart_items");   // Remove cart items
      router.push("/"); // Redirect to home page
    } else {
      toast.error("Order failed. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  } catch (error) {
    toast.error("Network error. Please try again.", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      theme: "colored",
    });
  }
};

return (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        minWidth: 400,
        minHeight: 220,
        borderRadius: 3,
        padding: 2,
      },
    }}
  >
    <DialogTitle
      sx={{
        fontWeight: "bold",
        color: "#0070f3",
        textAlign: "center",
        fontSize: "1.2rem",
        minHeight: "40px",
      }}
    >
      {!otpVerified ? (
        "OTP Verification"
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "#22c55e" }} />
          <span
            style={{
              color: "#22c55e",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            Verified
          </span>
        </Box>
      )}
    </DialogTitle>
    <DialogContent>
      {!otpVerified ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              mb: 2,
            }}
          >
            {otpDigits.map((digit, idx) => (
              <TextField
                key={idx}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "2rem",
                    width: "48px",
                    height: "56px",
                    padding: 0,
                  },
                }}
                inputRef={(el) => (inputRefs.current[idx] = el)}
                size="medium"
                variant="outlined"
              />
            ))}
          </Box>
          <button
            type="button"
            className="rts-btn btn-primary"
            style={{
              minWidth: 160,
              fontWeight: "bold",
              marginTop: "8px",
              width: "100%",
            }}
            onClick={handleVerifyOtp}
            disabled={otpDigits.some((d) => d === "")}
          >
            Verify
          </button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
          }}
        >
          <button
            type="button"
            className="rts-btn btn-primary"
            style={{
              minWidth: 160,
              fontWeight: "bold",
              marginTop: "16px",
              width: "60%",
            }}
            onClick={handleProceedOrder}
          >
            Proceed to Order
          </button>
        </Box>
      )}
    </DialogContent>
  </Dialog>
);
};

export default OtpPopup;

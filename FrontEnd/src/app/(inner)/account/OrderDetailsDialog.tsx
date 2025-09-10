import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

type Address = {
  name?: string;
  mobile_number?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  pincode: string;
  landmark?: string;
};

type Invoice = {
  pdf_url: string;
};

type OrderItem = {
  product_name: string;
  quantity: number;
  price_per_unit: string;
  discount_amount: string;
};

type OrderDetailsDialogProps = {
  open: boolean;
  onClose: () => void;
  address?: Address;
  invoice?: Invoice;
  orderItems?: OrderItem[];
};

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  open,
  onClose,
  address,
  invoice,
  orderItems,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle
      sx={{
        background: "#FF9900",
        color: "#fff",
        fontWeight: 700,
        fontSize: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // <-- add this
        px: 3,
      }}
    >
      <span>Address Details</span>
      {invoice?.pdf_url ? (
        <Button
          variant="contained"
          color="primary"
          href={invoice.pdf_url}
          target="_blank"
          download
          sx={{ minWidth: 150, fontWeight: 700 }}
        >
          DOWNLOAD INVOICE
        </Button>
      ) : (
        <Typography sx={{ fontSize: 16, mb: 0, color: "#fff" }}>
          <strong>Download Invoice:</strong> -
        </Typography>
      )}
    </DialogTitle>
    <DialogContent
      dividers
      sx={{
        maxHeight: 400, // set max height for scroll
        overflowY: "auto",
      }}
    >
      {/* Address and Invoice Button on same line */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginTop: 16,
          gap: 24,
        }}
      >
        {/* Address fields in a grid */}
        {address && (
          <div style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                Name:{" "}
                <span style={{ fontWeight: 400 }}>{address.name || "-"}</span>
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                Mob. No:{" "}
                <span style={{ fontWeight: 400 }}>
                  {address.mobile_number || "-"}
                </span>
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                Address Line 1:{" "}
                <span style={{ fontWeight: 400 }}>
                  {address.address_line1 || "-"}
                </span>
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                Address Line 2:{" "}
                <span style={{ fontWeight: 400 }}>
                  {address.address_line2 || "-"}
                </span>
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                City:{" "}
                <span style={{ fontWeight: 400 }}>{address.city || "-"}</span>
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                Pincode:{" "}
                <span style={{ fontWeight: 400 }}>
                  {address.pincode || "-"}
                </span>
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                Landmark:{" "}
                <span style={{ fontWeight: 400 }}>
                  {address.landmark || "-"}
                </span>
              </Typography>
              <span />
            </div>
          </div>
        )}
        {/* Invoice button aligned right */}
      </div>
      {/* Products Table (MUI) */}
      {orderItems && (
        <Table sx={{ width: "100%", mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ background: "#22c55e", color: "#fff", fontWeight: 700 }}
              >
                S.No
              </TableCell>
              <TableCell
                sx={{ background: "#22c55e", color: "#fff", fontWeight: 700 }}
              >
                PRODUCT
              </TableCell>
              <TableCell
                align="center"
                sx={{ background: "#22c55e", color: "#fff", fontWeight: 700 }}
              >
                QUANTITY
              </TableCell>
              <TableCell
                align="right"
                sx={{ background: "#22c55e", color: "#fff", fontWeight: 700 }}
              >
                ORIGINAL PRICE (₹)
              </TableCell>
              <TableCell
                align="right"
                sx={{ background: "#22c55e", color: "#fff", fontWeight: 700 }}
              >
                OFFER PRICE (₹)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItems.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item.product_name}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">
                  {parseFloat(
                    String(item.price_per_unit).replace(/^'+/, "")
                  ).toFixed(2)}
                </TableCell>

                <TableCell align="right">
                  {parseFloat(
                    String(item.discount_amount).replace(/^'+/, "")
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DialogContent>
    <DialogActions>
      <Button
        onClick={onClose}
        color="inherit"
        variant="outlined"
        sx={{
          color: "#222",
          fontWeight: 600,
          // backgroundColor: "",
          "&:hover": {
            backgroundColor: "#e53935",
            color: "#fff",
          },
        }}
      >
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default OrderDetailsDialog;

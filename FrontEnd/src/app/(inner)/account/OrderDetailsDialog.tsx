import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

type Address = {
  address_line1: string;
  address_line2?: string;
  city: string;
  pincode: string;
  landmark?: string;
};

type Invoice = {
  pdf_url: string;
};

type OrderDetailsDialogProps = {
  open: boolean;
  onClose: () => void;
  address?: Address;
  invoice?: Invoice;
};

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  open,
  onClose,
  address,
  invoice,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Order Details</DialogTitle>
    <DialogContent dividers>
      {address && (
        <>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Customer Address
          </Typography>
          <Typography>
            {address.address_line1}
            {address.address_line2 && <>, {address.address_line2}</>}
            <br />
            {address.city} - {address.pincode}
            {address.landmark && <>, Landmark: {address.landmark}</>}
          </Typography>
        </>
      )}
      {invoice && (
        <Button
          variant="contained"
          color="primary"
          href={invoice.pdf_url}
          target="_blank"
          download
          sx={{ mt: 3 }}
        >
          Download Invoice
        </Button>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="inherit">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default OrderDetailsDialog;

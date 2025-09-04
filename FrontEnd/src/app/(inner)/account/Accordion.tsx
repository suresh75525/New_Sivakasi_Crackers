import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, getOrderDtls } from "@/components/services/apiServices";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import OrderDetailsDialog from "./OrderDetailsDialog";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
type OrderItem = {
  product_name: string;
  quantity: number;
  price_per_unit: string;
  discount_amount: string;
};

type Invoice = {
  pdf_url: string;
};

type Address = {
  address_line1: string;
  address_line2?: string;
  city: string;
  pincode: string;
  landmark?: string;
};

type Order = {
  order_id: number;
  OrderItems: OrderItem[];
  Invoice: Invoice;
  Address: Address; // <-- Add this line
};
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function AccountTabs() {
  const [tabValue, setTabValue] = React.useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [ordersLoading, setOrdersLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  useEffect(() => {
    if (!loading) {
      getOrderDtls()
        .then((data) => {
          setOrders(data.orders || []);
          setOrdersLoading(false);
        })
        .catch(() => setOrdersLoading(false));
    }
  }, [loading]);

  const handleViewClick = (order: Order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Box sx={{ width: "100%", px: { xs: 0, sm: 2 } }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="account tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: { xs: 36, sm: 48 },
            ".MuiTab-root": {
              fontSize: { xs: 13, sm: 16 },
              minWidth: { xs: 80, sm: 120 },
              py: { xs: 0.5, sm: 1 },
            },
          }}
        >
          <Tab label="Orders" {...a11yProps(0)} />
          <Tab label="Invoices" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabValue} index={0}>
        {ordersLoading ? (
          <div>Loading orders...</div>
        ) : (
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <TableContainer component={Paper} sx={{ minWidth: 320 }}>
              <Table sx={{ minWidth: 650 }} aria-label="orders table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#222",
                        backgroundColor: "#FF9900",
                      }}
                    >
                      S.No
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#222",
                        backgroundColor: "#FF9900",
                      }}
                    >
                      Order Id
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#222",
                        backgroundColor: "#FF9900",
                      }}
                    >
                      Product
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#222",
                        backgroundColor: "#FF9900",
                      }}
                      align="center"
                    >
                      Quantity
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#222",
                        backgroundColor: "#FF9900",
                      }}
                      align="right"
                    >
                      Original Price
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#222",
                        backgroundColor: "#FF9900",
                      }}
                      align="right"
                    >
                      Offer Price
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#222",
                        backgroundColor: "#FF9900",
                      }}
                      align="right"
                    >
                      View
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                  {orders.map((order: Order, idx: number) =>
                    order.OrderItems.map((item: OrderItem, itemIdx: number) => (
                      <TableRow key={`${order.order_id}-${itemIdx}`}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{order.order_id}</TableCell>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">
                          Rs. {parseFloat(item.price_per_unit).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          Rs.{" "}
                          {(
                            parseFloat(item.price_per_unit) -
                            parseFloat(item.discount_amount)
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleViewClick(order)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </CustomTabPanel>
      <OrderDetailsDialog
        open={openDialog}
        onClose={handleCloseDialog}
        address={selectedOrder?.Address}
        invoice={selectedOrder?.Invoice}
      />
    </Box>
  );
}

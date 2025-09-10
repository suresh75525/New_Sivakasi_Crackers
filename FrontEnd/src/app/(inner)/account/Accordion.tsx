import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, getOrderDtls } from "@/components/services/apiServices";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import OrderDetailsDialog from "./OrderDetailsDialog";
import OrdersTable from "./OrdersTable";
import InvoicesTable from "./InvoicesTable";

// Add these types if not imported elsewhere
type OrderItem = {
  product_name: string;
  quantity: number;
  price_per_unit: string;
  discount_amount: string;
};

type Invoice = {
  pdf_url: string;
  invoice_number?: string;
  date?: string;
  amount?: string;
};

type Address = {
  name?: string;
  mobile_number?: string;
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
  Address: Address;
};

interface CustomTabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: CustomTabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function AccountTabs() {
  const [tabValue, setTabValue] = React.useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
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

  // Prepare invoices array for InvoicesTable
  const invoices = orders.map((order) => order.Invoice);

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
              fontSize: { xs: 13, sm: 15 },
              minWidth: { xs: 80, sm: 120 },
              py: { xs: 0.5, sm: 1 },
              fontWeight: 700,
              color: "#222",
              textTransform: "none",
            },
            ".Mui-selected": {
              color: "#222 !important",
            },
          }}
        >
          <Tab label="Orders" />
          <Tab label="Invoices" />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabValue} index={0}>
        <OrdersTable
          orders={orders}
          loading={ordersLoading}
          page={page}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          onViewClick={handleViewClick}
        />
        <OrderDetailsDialog
          open={openDialog}
          onClose={handleCloseDialog}
          address={selectedOrder?.Address}
          invoice={selectedOrder?.Invoice}
          orderItems={selectedOrder?.OrderItems}
        />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <InvoicesTable invoices={invoices} />
      </CustomTabPanel>
    </Box>
  );
}

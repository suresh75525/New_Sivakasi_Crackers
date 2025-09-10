import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";

export default function OrdersTable({
  orders,
  loading,
  page,
  rowsPerPage,
  setPage,
  onViewClick,
}: any) {
  if (loading) return <div>Loading orders...</div>;
  return (
    <TableContainer component={Paper} sx={{ minWidth: 320 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ fontWeight: 700, backgroundColor: "#FF9900", fontSize: 13 }}
            >
              S.No
            </TableCell>
            <TableCell
              sx={{ fontWeight: 700, backgroundColor: "#FF9900", fontSize: 13 }}
            >
              Order Id
            </TableCell>
            <TableCell
              sx={{ fontWeight: 700, backgroundColor: "#FF9900", fontSize: 13 }}
            >
              No Of Products
            </TableCell>
            <TableCell
              sx={{ fontWeight: 700, backgroundColor: "#FF9900", fontSize: 13 }}
              align="right"
            >
              Tot. Original Price (₹)
            </TableCell>
            <TableCell
              sx={{ fontWeight: 700, backgroundColor: "#FF9900", fontSize: 13 }}
              align="right"
            >
              Tot. Offer Price (₹)
            </TableCell>
            <TableCell
              sx={{ fontWeight: 700, backgroundColor: "#FF9900", fontSize: 13 }}
              align="right"
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((order: any, idx: number) => {
              const totOriginal = order.OrderItems.reduce(
                (sum: number, item: any) =>
                  sum + parseFloat(item.price_per_unit),
                0
              );
              const totOffer = order.OrderItems.reduce(
                (sum: number, item: any) =>
                  sum + parseFloat(item.discount_amount),
                0
              );
              return (
                <TableRow key={order.order_id}>
                  <TableCell sx={{ fontSize: 17 }}>
                    {page * rowsPerPage + idx + 1}
                  </TableCell>
                  <TableCell sx={{ fontSize: 17 }}>{order.order_id}</TableCell>
                  <TableCell sx={{ fontSize: 17 }}>
                    {order.OrderItems.length}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: 17 }}>
                    {totOriginal.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: 17 }}>
                    {totOffer.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: 17 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={() => onViewClick(order)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={orders.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5]}
      />
    </TableContainer>
  );
}

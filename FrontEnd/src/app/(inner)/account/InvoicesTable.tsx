import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import { getProducts, getCategories } from "@/components/services/apiServices";

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  offer: number;
};

type InvoiceRow = {
  category: string | number;
  product: Product | null;
  quantity: string;
  price: string | number;
  offer: string | number;
};

export default function InvoicesTable({ invoices, onViewClick }: any) {
  const [showCreate, setShowCreate] = useState(false);
  const [rows, setRows] = useState<InvoiceRow[]>([
    {
      category: "",
      product: null,
      quantity: "",
      price: "",
      offer: "",
    },
  ]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getCategories().then((data) => setCategories(data.categories || []));
    getProducts().then((data) => setProducts(data.products || []));
  }, []);

  const handleAddRow = () => {
    setRows([
      ...rows,
      { category: "", product: null, quantity: "", price: "", offer: "" },
    ]);
  };

  const handleRowChange = (
    idx: number,
    field: keyof InvoiceRow,
    value: any
  ) => {
    const updatedRows = [...rows];
    updatedRows[idx][field] = value;

    // Auto-complete price and offer when product is selected
    if (field === "product" && value) {
      updatedRows[idx].price = value.price;
      updatedRows[idx].offer = value.offer;
    }
    setRows(updatedRows);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          color="success"
          sx={{ fontWeight: 700 }}
          onClick={() => setShowCreate(true)}
        >
          Create Invoice
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ fontWeight: 700 }}
          onClick={() => setShowCreate(false)}
        >
          Invoice Details
        </Button>
      </Box>
      {!showCreate ? (
        <TableContainer component={Paper} sx={{ minWidth: 320 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    backgroundColor: "#FF9900",
                    fontSize: 13,
                  }}
                >
                  S.No
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    backgroundColor: "#FF9900",
                    fontSize: 13,
                  }}
                >
                  Invoice No
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    backgroundColor: "#FF9900",
                    fontSize: 13,
                  }}
                >
                  Download
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontSize: 17 }}>{idx + 1}</TableCell>
                  <TableCell sx={{ fontSize: 17 }}>
                    {invoice.invoice_number || `INV-${idx + 1}`}
                  </TableCell>
                  <TableCell sx={{ fontSize: 17 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onViewClick(invoice)}
                      sx={{ minWidth: 120, fontWeight: 700 }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper} sx={{ minWidth: 320 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    backgroundColor: "#22c55e",
                    color: "#fff",
                  }}
                >
                  S.No
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    backgroundColor: "#22c55e",
                    color: "#fff",
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    backgroundColor: "#22c55e",
                    color: "#fff",
                  }}
                >
                  Product Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    backgroundColor: "#22c55e",
                    color: "#fff",
                  }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    backgroundColor: "#22c55e",
                    color: "#fff",
                  }}
                >
                  Original Price
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    backgroundColor: "#22c55e",
                    color: "#fff",
                  }}
                >
                  Offer Price
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    backgroundColor: "#22c55e",
                    color: "#fff",
                  }}
                >
                  Add Row
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    <Select
                      value={row.category}
                      onChange={(e) =>
                        handleRowChange(idx, "category", e.target.value)
                      }
                      displayEmpty
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="">
                        <em>Select Category</em>
                      </MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Autocomplete
                      options={products.filter(
                        (p) => p.categoryId === Number(row.category)
                      )}
                      getOptionLabel={(option) => option.name}
                      value={row.product}
                      onChange={(_, value) =>
                        handleRowChange(idx, "product", value)
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Product Name" />
                      )}
                      sx={{ minWidth: 150 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.quantity}
                      onChange={(e) =>
                        handleRowChange(idx, "quantity", e.target.value)
                      }
                      label="Quantity"
                      sx={{ minWidth: 80 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.price}
                      label="Original Price"
                      sx={{ minWidth: 100 }}
                      InputProps={{ readOnly: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.offer}
                      label="Offer Price"
                      sx={{ minWidth: 100 }}
                      InputProps={{ readOnly: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={handleAddRow}
                      disabled={!row.category || !row.product || !row.quantity}
                    >
                      Add Row
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

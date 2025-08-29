const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const User = require("../models/User");
const Address = require("../models/Address");

// ---------- helpers ----------
const INR = (n) => `₹${Number(n || 0).toFixed(2)}`;
const ensureDir = (p) => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
};
const abs = (p) =>
  !p ? null : path.isAbsolute(p) ? p : path.join(process.cwd(), p);

function brandInfo() {
  return {
    name: process.env.INVOICE_COMPANY_NAME || "SIVAKASI CRACKERS",
    email:
      process.env.INVOICE_COMPANY_EMAIL || "sivakasikrackerssvks@gmail.com",
    phone: process.env.INVOICE_COMPANY_PHONE || "9842972802, 7806999160",
    year: new Date().getFullYear(),
    logo: abs(process.env.INVOICE_LOGO_PATH || ""), // optional
  };
}

// ---------- sections ----------
function drawTopBar(doc) {
  // slim colored brand bar
  doc.save();
  doc.rect(0, 0, doc.page.width, 60).fill("#2C2C54");
  doc.restore();

  // accent
  doc.save();
  doc.rect(0, 60, doc.page.width, 6).fill("#FFC233");
  doc.restore();
}

function drawBrandHeader(doc) {
  const b = brandInfo();

  // logo
  if (b.logo && fs.existsSync(b.logo)) {
    try {
      doc.image(b.logo, 32, 12, { height: 46 });
    } catch {}
  }

  doc
    .fillColor("#FFFFFF")
    .font("Helvetica-Bold")
    .fontSize(20)
    .text(b.name, 120, 16);

  doc.font("Helvetica").fontSize(10);
  doc.text(`${b.year}`, 120, 38);

  doc.fontSize(10);
  doc.text(`email: ${b.email}`, 380, 18, { align: "left", width: 200 });
  doc.text(`Contact: ${b.phone}`, 380, 34, { align: "left", width: 200 });
}

function drawCustomerBlock(doc, y, order, addr) {
  doc.fillColor("#111").font("Helvetica").fontSize(10);

  const L = 32,
    W = (doc.page.width - 64) / 2;

  // left col
  doc.text(`Cus. Name : ${order.User?.name || ""}`, L, y);
  doc.text(`Address   : ${addr?.address_line1 || ""}`, L, y + 16);
  doc.text(`Pin code   : ${addr?.pincode || ""}`, L, y + 32);

  // right col
  doc.text(`Mobile No : ${order.User?.mobile_number || ""}`, L + W + 12, y);
  doc.text(`City    : ${addr?.city || ""}`, L + W + 12, y + 16);

  return y + 52;
}

function tableHeader(doc, y) {
  // header background
  doc.save();
  doc.rect(32, y, doc.page.width - 64, 24).fill("#F6F6FA");
  doc.restore();

  doc.fillColor("#111").font("Helvetica-Bold").fontSize(10);

  // columns (like your sheet and screenshot)
  const cols = {
    sno: 40,
    name: 80,
    pcs: 360,
    apr: 430,
    ofr: 510,
  };

  doc.text("S.No", cols.sno, y + 6, { width: 40 });
  doc.text("Particular", cols.name, y + 6, { width: 260 });
  doc.text("Pcs/Box", cols.pcs, y + 6, { width: 60, align: "right" });
  doc.text("Actual Price", cols.apr, y + 6, { width: 70, align: "right" });
  doc.text("Offer Price", cols.ofr, y + 6, { width: 70, align: "right" });

  // border line
  doc
    .moveTo(32, y + 24)
    .lineTo(doc.page.width - 32, y + 24)
    .lineWidth(0.7)
    .strokeColor("#DDD")
    .stroke();

  return { y: y + 28, cols };
}

function tableRows(doc, y, cols, items) {
  doc.font("Helvetica").fontSize(10).fillColor("#222");
  let zebra = false;

  items.forEach((it, idx) => {
    const rowH = 18;
    // zebra bg
    if (zebra) {
      doc.save();
      doc.rect(32, y - 2, doc.page.width - 64, rowH + 4).fill("#FBFBFF");
      doc.restore();
    }
    zebra = !zebra;

    const qty = Number(it.quantity || 0);
    const aprU = Number(it.price_per_unit || 0);
    const disL = Number(it.discount_amount || 0);
    const ofrU = qty > 0 ? aprU - disL / qty : aprU;

    doc.text(String(idx + 1), cols.sno, y, { width: 40 });
    doc.text(it.product_name || "", cols.name, y, { width: 260 });
    doc.text(qty.toString(), cols.pcs, y, { width: 60, align: "right" });
    doc.text(INR(aprU), cols.apr, y, { width: 70, align: "right" });
    doc.text(INR(ofrU), cols.ofr, y, { width: 70, align: "right" });

    y += rowH;
  });

  // bottom border
  doc
    .moveTo(32, y)
    .lineTo(doc.page.width - 32, y)
    .lineWidth(0.7)
    .strokeColor("#DDD")
    .stroke();
  return y;
}

function totalsPanel(doc, y, totals) {
  // left notice
  doc.font("Helvetica-Bold").fontSize(11).fillColor("#D11");
  doc.text("Not Return or Not Exchange", 40, y);

  // right summary box
  const boxW = 220,
    boxH = 86,
    boxX = doc.page.width - 40 - boxW,
    boxY = y - 10;
  doc.save();
  doc
    .roundedRect(boxX, boxY, boxW, boxH, 8)
    .lineWidth(0.8)
    .strokeColor("#E6E6F3")
    .stroke()
    .fillColor("#FFFFFF");
  doc.restore();

  const L = boxX + 14;
  doc.font("Helvetica").fontSize(10).fillColor("#333");
  doc.text("Total :", L, boxY + 12);
  doc.text("Discount :", L, boxY + 30);
  doc.text("GST :", L, boxY + 48);
  doc.font("Helvetica-Bold").text("Net Amt :", L, boxY + 66);

  const V = boxX + boxW - 14;
  doc.font("Helvetica").text(INR(totals.subtotal), V - 110, boxY + 12, {
    width: 110,
    align: "right",
  });
  doc.text(INR(totals.discount), V - 110, boxY + 30, {
    width: 110,
    align: "right",
  });
  doc.text(INR(totals.gst), V - 110, boxY + 48, { width: 110, align: "right" });
  doc
    .font("Helvetica-Bold")
    .text(INR(totals.net), V - 110, boxY + 66, { width: 110, align: "right" });

  return boxY + boxH + 14;
}

function footer(doc) {
  // yellow strip + “HAPPY DIWALI”
  doc.save();
  doc.rect(0, doc.page.height - 40, doc.page.width, 40).fill("#FFC233");
  doc.restore();

  doc
    .fillColor("#2C2C54")
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("HAPPY DIWALI", 0, doc.page.height - 30, {
      width: doc.page.width,
      align: "center",
    });
}

// ---------- main ----------
async function generateInvoice(orderId) {
  // fetch data
  const order = await Order.findByPk(orderId, {
    include: [
      { model: User, attributes: ["name", "mobile_number"] },
      { model: OrderItem },
    ],
  });
  if (!order) throw new Error("Order not found for invoice");
  const addr = await Address.findOne({ where: { order_id: orderId } });

  // compute totals
  let subtotal = 0,
    discount = 0,
    gst = 0;
  const rows = order.OrderItems.map((oi) => {
    const qty = Number(oi.quantity || 0);
    const aprU = Number(oi.price_per_unit || 0);
    const disL = Number(oi.discount_amount || 0); // line discount Rs
    const gstP = Number(oi.gst_percentage || 0);

    subtotal += aprU * qty;
    discount += disL;
    const baseAfterDiscount = aprU * qty - disL;
    const gstAmt =
      oi.gst_amount != null
        ? Number(oi.gst_amount)
        : (baseAfterDiscount * gstP) / 100;
    gst += gstAmt;

    return {
      product_name: oi.product_name,
      quantity: qty,
      price_per_unit: aprU,
      discount_amount: disL,
      gst_percentage: gstP,
    };
  });

  const net = subtotal - discount + gst;

  // output
  const dir = path.join(__dirname, "..", "invoices");
  ensureDir(dir);
  const filePath = path.join(dir, `invoice_${orderId}.pdf`);

  const doc = new PDFDocument({ size: "A4", margin: 32 });
  doc.pipe(fs.createWriteStream(filePath));

  drawTopBar(doc);
  drawBrandHeader(doc);

  // meta band
  doc.fillColor("#666").font("Helvetica").fontSize(10);
  doc.text(`Invoice No: ${order.order_id}`, 32, 78);
  const created = order.created_at ? new Date(order.created_at) : new Date();
  doc.text(
    `Date: ${created.toLocaleDateString("en-IN")} ${created.toLocaleTimeString(
      "en-IN",
      { hour: "2-digit", minute: "2-digit" }
    )}`,
    260,
    78
  );
  doc.text(`Order Status: ${order.order_status}`, 480, 78, { align: "left" });

  let y = 104;
  // thin divider
  doc
    .moveTo(32, y)
    .lineTo(doc.page.width - 32, y)
    .lineWidth(0.8)
    .strokeColor("#EEE")
    .stroke();
  y += 12;

  // customer block
  y = drawCustomerBlock(doc, y, order, addr);

  // table
  const th = tableHeader(doc, y);
  y = th.y;
  y = tableRows(doc, y, th.cols, rows);

  // totals
  y += 18;
  y = totalsPanel(doc, y, { subtotal, discount, gst, net });

  // footer
  footer(doc);

  doc.end();
  return filePath;
}

module.exports = { generateInvoice };

import { Invoice } from "@/entities/Invoice";
import { format, parseISO } from "date-fns";
import OpenSansLight from "@/public/fonts/OpenSans-Light.ttf";
import OpenSansSemiBold from "@/public/fonts/OpenSans-SemiBold.ttf";
import OpenSansMedium from "@/public/fonts/OpenSans-Medium.ttf";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
  Font,
} from "@react-pdf/renderer";
import { Product } from "@/entities/Product";
import { Staff } from "@/entities/Staff";
import { Store } from "@/entities/Store";
import { Customer } from "@/entities/Customer";

Font.register({
  family: "OpenSansv2",
  fonts: [
    {
      src: OpenSansLight,
      fontWeight: 400,
    },
    {
      src: OpenSansMedium,
      fontWeight: 700,
    },
  ],
});

const pdfStyleSheet = StyleSheet.create({
  page: {
    padding: 20,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#ffffff",
    fontFamily: "OpenSansv2",
  },
  invoiceTitle: {
    fontSize: 24,
    textTransform: "uppercase",
    fontWeight: 700,
  },
  description: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  firstDescription: {
    display: "flex",
    flexDirection: "column",
    flex: "100 1 1",
  },
  secondDescription: {
    display: "flex",
    flexDirection: "column",
    flex: "100 1 1",
  },
  descriptionTitle: {
    fontWeight: 700,
  },
  flexJustifyBetween: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
});

const createInvoicePdf = async (
  invoice: Invoice,
  products: Product[],
  staff: Staff,
  storeInfo: Store,
  chosenCustomer: Customer | null,
) => {
  const InvoiceView = () => (
    <Document>
      <Page size="A4" style={pdfStyleSheet.page}>
        <Text style={pdfStyleSheet.invoiceTitle}>Invoice</Text>
        <View style={pdfStyleSheet.description}>
          <View style={pdfStyleSheet.firstDescription}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={pdfStyleSheet.descriptionTitle}>
                Invoice&apos;s id:{" "}
              </Text>
              <Text>{invoice.id}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={pdfStyleSheet.descriptionTitle}>Staff: </Text>
              <Text>{staff.name}</Text>
            </View>
          </View>
          <View style={pdfStyleSheet.secondDescription}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={pdfStyleSheet.descriptionTitle}>Issued date: </Text>
              <Text>{format(parseISO(invoice.createdAt), "MM/dd/yyyy")}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={pdfStyleSheet.descriptionTitle}>Issued time: </Text>
              <Text>{format(parseISO(invoice.createdAt), "hh:mm:ss")}</Text>
            </View>
          </View>
        </View>
        <Text style={{ width: "100%", fontWeight: 700 }}>Description</Text>
        <View
          style={{
            width: "100%",
            height: 0,
            borderBottom: "1 dashed #aaaaaa",
          }}
        />
        {invoice.invoiceDetails.map((detail, idx) => {
          const detailProduct = products.find(
            (product) => product.id === detail.productId,
          )!;
          return (
            <View key={idx} style={{ width: "100%" }}>
              <Text>
                {detailProduct.name}{" "}
                {detailProduct.propertiesString
                  ? `(${detailProduct.propertiesString})`
                  : ""}
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingLeft: 20,
                  width: "100%",
                }}
              >
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 20 }}
                >
                  <Text>{detail.quantity}</Text>
                  <Text>{detailProduct.salesUnits.name}</Text>
                  <Text>x</Text>
                  <Text>{detail.price}</Text>
                </View>
                <Text>{detail.price * detail.quantity}</Text>
              </View>
            </View>
          );
        })}
        <View
          style={{
            width: "100%",
            height: 0,
            borderBottom: "1 dashed #aaaaaa",
          }}
        />
        <View style={pdfStyleSheet.flexJustifyBetween}>
          <Text style={{ fontWeight: 700 }}>Sub total:</Text>
          <Text style={{ fontWeight: 400 }}>{invoice.subTotal}</Text>
        </View>
        {invoice.discountCode ? (
          <>
            <View style={{ ...pdfStyleSheet.flexJustifyBetween }}>
              <Text style={{ fontWeight: 700 }}>Discount applied:</Text>
              <Text style={{ fontWeight: 400 }}>{invoice.discountCode}</Text>
            </View>
            <View style={pdfStyleSheet.flexJustifyBetween}>
              <Text style={{ fontWeight: 700 }}>Discount value:</Text>
              <Text style={{ fontWeight: 400 }}>{invoice.discountValue}</Text>
            </View>
          </>
        ) : null}
        <View style={pdfStyleSheet.flexJustifyBetween}>
          <Text style={{ fontWeight: 700 }}>
            Total &#40;Pay by {invoice.paymentMethod}&#41;:
          </Text>
          <Text style={{ fontWeight: 400 }}>{invoice.total}</Text>
        </View>
        <Text>
          {storeInfo?.name ?? "Limited Liability Company 4 Members@Inc"}
        </Text>
        <Text>Thank you customer!</Text>
        <Text>See you soon!</Text>
      </Page>
    </Document>
  );

  const blob = await pdf(InvoiceView()).toBlob();
  const objectURL = URL.createObjectURL(blob);

  const iframe = document.createElement("iframe");
  iframe.style.display = "none"; // Hide the iframe
  document.body.appendChild(iframe);
  iframe.src = objectURL;
  iframe.onload = () => {
    iframe.contentWindow!.print();
    URL.revokeObjectURL(objectURL);
  };
};

export default createInvoicePdf;

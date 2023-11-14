type Product = {
  id: number;
  name: string;
  barcode: string;
  location: string;
  originalPrice: number; // originalPrice
  productPrice: number;
  stock: number;
  status: string;
  weight: number;
  description: string;
  note: string;
  minStock: number; // minstock
  maxStock: number; // maxstock
  productGroup: string;
  productBrand: string;
  productProperties: {
    id: number;
    propertyName: string;
    propertyValue: string;
  }[];
  images: string[];
  salesUnits: {
    /// why does it have "s"
    id: number;
    basicUnit: string;
    name: string;
    exchangeValue: number;
  };
}

export default Product;

export const sampleProducts: Product[] = [
  {
    id: 2,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description. Another sample product description. Another sample product description. Another sample product description. Another sample product description. ",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    },
  },
  {
    id: 3,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 4,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
  {
    id: 5,
    name: "Another Sample Product",
    barcode: "XYZ789",
    location: "Aisle 2, Shelf 3",
    originalPrice: 15.0,
    productPrice: 25.0,
    stock: 50,
    status: "In Stock",
    weight: 50,
    description: "Another sample product description.",
    note: "Additional notes for the second product.",
    minStock: 5,
    maxStock: 100,
    productGroup: "Clothing",
    productBrand: "Another Brand",
    productProperties: [{
      id: 1,
      propertyName: 'Mau sac',
      propertyValue: 'Do',
    }],
    images: [
      "https://example.com/another-product-image.jpg",
      "https://example.com/another-product-image2.jpg",
    ],
    salesUnits: {
      id: 1,
      basicUnit: 'Kekw',
      name: 'Kekw',
      exchangeValue: 1,
    }
  },
];

import {Product, ProductBrand, ProductGroup, ProductLocation, ProductProperty} from "@/entities/Product";
import AxiosService from "./axios_service";

const createNewGroup = (value: ProductGroup) => {
  return AxiosService.post("/api/product-groups", {
    name: value,
  });
};

const getAllGroups = () => {
  return AxiosService.get<ProductGroup[]>("/api/product-groups",);
};

const createNewLocation = (value: string) => {
  return AxiosService.post("/api/locations", {
    name: value,
  });
};

const getAllLocations = () => {
  return AxiosService.get<ProductLocation[]>("/api/locations");
};

const createNewBrand = (value: string) => {
  return AxiosService.post("/api/product-brands", {
    name: value,
  });
};

const getAllBrands = () => {
  return AxiosService.get<ProductBrand[]>("/api/product-brands");
};

const createNewProperty = (value: string) => {
  return AxiosService.post("/api/product-property-names", {
    name: value,
  });
};

const getAllProperties = () => {
  return AxiosService.get<ProductProperty[]>("/api/product-property-names");
};

const getAllProducts = () => {
  return AxiosService.get<Product[]>("/api/products");
};

const createNewProduct = (data: any) => {
  return AxiosService.post<Product>("/api/products", data);
};

const CatalogService = {
  createNewLocation,
  getAllLocations,
  createNewBrand,
  getAllBrands,
  createNewProperty,
  getAllProperties,
  createNewGroup,
  getAllGroups,
  createNewProduct,
  getAllProducts
};

export default CatalogService;
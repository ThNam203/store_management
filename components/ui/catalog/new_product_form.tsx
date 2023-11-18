"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import scrollbar_style from "@/styles/scrollbar.module.css";
import React, { useEffect, useState } from "react";
import { Check, Info, Pencil, Plus, PlusCircle, Trash, X } from "lucide-react";
import SearchAndChooseButton from "@/components/ui/catalog/search_filter";
import { ChooseImageButton } from "@/components/ui/catalog/choose_image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "../textarea";
import CatalogService from "@/services/catalog_service";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { Label } from "../label";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { Product } from "@/entities/Product";
import LoadingCircle from "../loading_circle";

const newProductFormSchema = z.object({
  barcode: z
    .string({ required_error: "Barcode is missing" })
    .trim()
    .min(1, { message: "Barcode is missing!" })
    .max(50, { message: "Barcode must be at most 50 characters!" }),
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is missing!" })
    .max(100, { message: "Product name must be at most 100 characters!" }),
  productGroup: z
    .string({ required_error: "Group is missing" })
    .trim()
    .min(1, { message: "Group is missing" }),
  productBrand: z.string().trim().optional(),
  location: z
    .string()
    .max(100, "Location must be at most 100 characters")
    .optional(),
  originalPrice: z
    .number()
    .min(0, { message: "Original price must be at least 0" })
    .max(Number.MAX_VALUE, {
      message: `Original price must be less than ${Number.MAX_VALUE}`,
    }),
  status: z.enum(["Active", "Disabled"]),
  productPrice: z
    .number()
    .min(0, { message: "Product price must be at least 0" })
    .max(Number.MAX_VALUE, {
      message: `Product price must be less than ${Number.MAX_VALUE}`,
    }),
  stock: z
    .number()
    .int()
    .min(0, { message: "Stock must be at least 0" })
    .max(Number.MAX_VALUE, {
      message: `Stock must be less than ${Number.MAX_VALUE}`,
    }),
  weight: z
    .number()
    .min(0, { message: "Weight must be at least 0" })
    .max(Number.MAX_VALUE, {
      message: `Weight must be less than ${Number.MAX_VALUE}`,
    }),
  minStock: z
    .number()
    .int()
    .min(0, { message: "Value must be at least 0" })
    .max(Number.MAX_VALUE, {
      message: `Value must be less than ${Number.MAX_VALUE}`,
    }),
  maxStock: z
    .number()
    .int()
    .min(0, { message: "Value must be at least 0" })
    .max(Number.MAX_VALUE, {
      message: `Value must be less than ${Number.MAX_VALUE}`,
    }),
  images: z.array(z.string().nullable()).min(0).max(5).optional(),
  properties: z
    .array(
      z.object({
        key: z.string().min(1, "Missing property name!"),
        values: z.array(z.string()).min(1, "Propety needs at least 1 value"),
      })
    )
    .nullable(),
  units: z.object({
    baseUnit: z
      .string({ required_error: "Missing base unit" })
      .min(1, { message: "Missing base unit" })
      .max(100, { message: "Base unit must be less than 100 characters" }),
    otherUnits: z
      .array(
        z.object({
          unitName: z
            .string({ required_error: "Missing unit name" })
            .min(1, { message: "Missing unit name" })
            .max(100, { message: "Unit name must be less than 100" }),
          exchangeValue: z
            .number({ required_error: "Missing exchange value!" })
            .min(0, { message: "Value must be at least 0" })
            .max(Number.MAX_VALUE, {
              message: `Value must be lest than ${Number.MAX_VALUE}`,
            }),
          price: z
            .number({ required_error: "Missing price!" })
            .min(0, { message: "Value must be at least 0" })
            .max(Number.MAX_VALUE, {
              message: `Value must be less than ${Number.MAX_VALUE}`,
            }),
        })
      )
      .optional(),
  }),
  description: z.string(),
  note: z.string(),
  sameTypeProducts: z.array(
    z.object({
      properties: z.record(z.string(), z.string()).optional(),
      unit: z.object({
        basicUnit: z.string(),
        name: z.string(),
        exchangeValue: z.number(),
      }),
      originalPrice: z
        .number()
        .min(0, { message: "Original price must be at least 0" })
        .max(Number.MAX_VALUE, {
          message: `Original price must be less than ${Number.MAX_VALUE}`,
        }),
      productPrice: z
        .number()
        .min(0, { message: "Product price must be at least 0" })
        .max(Number.MAX_VALUE, {
          message: `Product price must be less than ${Number.MAX_VALUE}`,
        }),
      stock: z
        .number()
        .int()
        .min(0, { message: "Stock must be at least 0" })
        .max(Number.MAX_VALUE, {
          message: `Stock must be less than ${Number.MAX_VALUE}`,
        }),
    })
  ),
});

export const NewProductView = ({
  onChangeVisibility,
  onNewProductsAdded,
  productLocations,
  productGroups,
  productBrands,
  productProperties,
  addNewLocation,
  addNewGroup,
  addNewBrand,
  addNewProperties,
}: {
  onChangeVisibility: (val: boolean) => any;
  onNewProductsAdded: (products: Product[]) => any;
  productLocations: string[];
  productGroups: string[];
  productBrands: string[];
  productProperties: string[];
  addNewLocation: (value: string) => any;
  addNewGroup: (value: string) => any;
  addNewBrand: (value: string) => any;
  addNewProperties: (value: string) => any;
}) => {
  const { toast } = useToast();
  const productLocationChoices = productLocations;
  const productGroupChoices = productGroups;
  const productBrandChoices = productBrands;
  const productPropertyChoices = productProperties;
  const [productPropertyInputValues, setProductPropertyInputValues] = useState<
    string[]
  >([]);
  const [openGroup, setOpenGroup] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openProperty, setOpenProperty] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [chosenImageFiles, setChosenImageFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [isCreatingNewProduct, setIsCreatingNewProduct] = useState(false);

  const form = useForm<z.infer<typeof newProductFormSchema>>({
    resolver: zodResolver(newProductFormSchema),
    defaultValues: {
      barcode: "",
      name: "",
      productGroup: "",
      productBrand: undefined,
      location: undefined,
      originalPrice: 0,
      productPrice: 0,
      status: "Active",
      stock: 0,
      weight: 0,
      minStock: 0,
      maxStock: 999999999,
      images: [null, null, null, null, null],
      properties: null,
      units: {
        baseUnit: "",
        otherUnits: undefined,
      },
      description: "",
      note: "",
    },
  });

  const updatePriceUnit = (value: number, index: number) => {
    const units = form.getValues("units.otherUnits");
    if (!units) return;

    const newUnits = units.map((val, idx) =>
      idx === index ? { ...val, price: value } : val
    );

    form.setValue("units", {
      baseUnit: form.getValues("units.baseUnit"),
      otherUnits: newUnits,
    });
  };

  const updatePriceUnits = () => {
    const units = form.getValues("units.otherUnits");
    const productPrice = form.getValues("productPrice");
    if (!units || !productPrice) return;

    const newUnits = units.map((val) => ({
      ...val,
      price: productPrice * val.exchangeValue,
    }));

    form.setValue("units", {
      baseUnit: form.getValues("units.baseUnit"),
      otherUnits: newUnits,
    });
  };

  const updateSameTypeProducts = () => {
    let properties = form.getValues("properties");
    let units = form.getValues("units.otherUnits");
    const baseUnit = form.getValues("units.baseUnit");
    let propertiesLength = 1;
    let unitsLength = 1;

    if (properties) {
      properties = properties.filter((pro) => pro.key.length > 0);
      properties.forEach((pro) => {
        if (pro.values.length > 0) propertiesLength *= pro.values.length;
      });
    }

    if (units) {
      units = units.filter((unit) => unit.unitName.length > 0);
      unitsLength += units.length;
    }

    if (propertiesLength * unitsLength <= 1) {
      form.setValue("sameTypeProducts", []);
      return;
    }

    const originalPrice = form.getValues("originalPrice");
    const productPrice = form.getValues("productPrice");
    const stock = form.getValues("stock");

    const sameTypeProducts: any[] = [];

    if (properties && properties.length > 0) {
      const propertyCombinations = cartesian(properties);
      propertyCombinations.forEach((combination) => {
        sameTypeProducts.push({
          originalPrice: originalPrice,
          productPrice: productPrice,
          stock: stock,
          properties: combination,
        });
      });
    }

    if (sameTypeProducts.length === 0) {
      sameTypeProducts.push({
        originalPrice: originalPrice,
        productPrice: productPrice,
        stock: stock,
        unit: {
          basicUnit: baseUnit,
          name: baseUnit,
          exchangeValue: 1,
        },
      });
    } else {
      sameTypeProducts.forEach((product) => {
        product["unit"] = {
          basicUnit: baseUnit,
          name: baseUnit,
          exchangeValue: 1,
        };
      });
    }

    // - 1 because of baseUnit above
    const baseProducts = [...sameTypeProducts];
    for (let i = 0; i < unitsLength - 1; i++) {
      const newProducts: any = baseProducts.map((product) => ({
        ...product,
        unit: {
          basicUnit: baseUnit,
          name: units![i].unitName,
          exchangeValue: units![i].exchangeValue,
        },
        productPrice: units![i].price,
      }));
      sameTypeProducts.push(...newProducts);
    }

    form.setValue("sameTypeProducts", sameTypeProducts);
  };
  // if newFileUrl == null, it means the user removed image
  const handleImageChosen = (newFileUrl: File | null, index: number) => {
    if (newFileUrl === null) {
      for (let i = index; i < chosenImageFiles.length - 1; i++) {
        chosenImageFiles[i] = chosenImageFiles[i + 1];
      }
      chosenImageFiles[chosenImageFiles.length - 1] = null;
    } else chosenImageFiles[chosenImageFiles.indexOf(null)] = newFileUrl;

    form.setValue(
      "images",
      chosenImageFiles.map((file) => (file ? URL.createObjectURL(file) : null)),
      { shouldValidate: true }
    );
    setChosenImageFiles(chosenImageFiles);
  };

  function onProductPropertyInputKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string,
    fieldValue: {
      values: string[];
      key: string;
    }[],
    index: number
  ): void {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim().length > 0) {
        if (fieldValue[index].values.includes(value)) {
          toast({
            description: "Property value has already existed",
            variant: "destructive",
          });
          return;
        }
        const newValue = fieldValue.map((v, i) => {
          if (i === index) {
            v.values.push(value);
            setProductPropertyInputValues((prev) => {
              prev[index] = "";
              return [...prev];
            });
          }
          return v;
        });
        form.setValue("properties", newValue);
      }
    }
  }

  function onProductPropertyValueDelete(
    index: number,
    deleteIndex: number,
    fieldValue: { values: string[]; key: string }[]
  ) {
    fieldValue[index].values.splice(deleteIndex, 1);
    form.setValue("properties", [...fieldValue]);
  }

  function onSubmit(values: z.infer<typeof newProductFormSchema>) {
    delete values.images; // get images from chosenImages
    let data: any[] = [];

    if (values.sameTypeProducts.length === 0) {
      data.push({
        ...values,
        salesUnits: {
          basicUnit: values.units.baseUnit,
          name: values.units.baseUnit,
          exchangeValue: 1,
        },
      });
      if (data[0].units) delete data[0].units;
    } else {
      data = values.sameTypeProducts.map((sameProduct) => {
        const newElement: any = {
          ...values,
          properties: sameProduct.properties
            ? Object.entries(sameProduct.properties).map((val) => ({
                propertyName: val[0],
                propertyValue: val[1],
              }))
            : undefined,
          salesUnits: {
            basicUnit: sameProduct.unit.basicUnit,
            name: sameProduct.unit.name,
            exchangeValue: sameProduct.unit.exchangeValue,
          },
        };
        delete newElement.units;
        delete newElement.sameTypeProducts;
        return newElement;
      });
    }

    const dataForm: any = new FormData();
    dataForm.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    dataForm.append(
      "files",
      chosenImageFiles.filter((file) => file != null)
    );

    setIsCreatingNewProduct(true);
    CatalogService.createNewProduct(dataForm)
      .then((result) => {
        onNewProductsAdded(result.data);
      })
      .catch((e) => axiosUIErrorHandler(e, toast))
      .finally(() => {
        onChangeVisibility(false);
        setIsCreatingNewProduct(false);
      });
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-30 z-[10]">
      <div
        className={cn(
          "rounded-md max-h-[95%] w-[95%] max-w-[960px] flex flex-col p-4 bg-white overflow-y-auto",
          scrollbar_style.scrollbar
        )}
      >
        <div className="flex flex-row items-center justify-between mb-4">
          <h3 className="font-semibold text-base">Add new product</h3>
          <X
            size={24}
            className="hover:cursor-pointer rounded-full hover:bg-slate-200 p-1"
            onClick={() => onChangeVisibility(false)}
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          >
            <div className="flex flex-col md:flex-row w-full h-full md:gap-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Barcode</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input className="flex-1 !m-0" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Product name</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input className="flex-1 !m-0" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productGroup"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Product group</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-row flex-1 min-h-[40px] border border-input rounded-md !m-0 items-center">
                          <div className="w-full h-full flex-1">
                            <SearchAndChooseButton
                              value={field.value}
                              placeholder="---Choose group---"
                              searchPlaceholder="Search product..."
                              // onValueChanged={setProductGroup}
                              onValueChanged={(val) => {
                                form.setValue(
                                  "productGroup",
                                  val === undefined ? "" : val,
                                  { shouldValidate: true }
                                );
                              }}
                              choices={productGroupChoices}
                            />
                          </div>
                          <AddNewThing
                            title="Add new group"
                            placeholder="Group's name"
                            open={openGroup}
                            onOpenChange={setOpenGroup}
                            onAddClick={addNewGroup}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productBrand"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Product brand</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-row flex-1 min-h-[40px] border border-input rounded-md !m-0 items-center">
                          <div className="w-full h-full flex-1">
                            <SearchAndChooseButton
                              value={field.value}
                              placeholder="---Choose brand---"
                              searchPlaceholder="Search brand..."
                              onValueChanged={(val) => {
                                form.setValue("productBrand", val, {
                                  shouldValidate: true,
                                });
                              }}
                              choices={productBrandChoices}
                            />
                          </div>
                          <AddNewThing
                            title="Add new brand"
                            placeholder="Brand's name"
                            open={openBrand}
                            onOpenChange={setOpenBrand}
                            onAddClick={addNewBrand}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Location</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-row flex-1 min-h-[40px] border border-input rounded-md !m-0 items-center">
                          <div className="w-full h-full flex-1">
                            <SearchAndChooseButton
                              value={field.value}
                              placeholder="---Choose location---"
                              searchPlaceholder="Search location..."
                              onValueChanged={(val) => {
                                form.setValue("location", val, {
                                  shouldValidate: true,
                                });
                              }}
                              choices={productLocationChoices}
                            />
                          </div>
                          <AddNewThing
                            title="Add new location"
                            placeholder="Location's name"
                            open={openLocation}
                            onOpenChange={setOpenLocation}
                            onAddClick={addNewLocation}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Weight</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl className="flex flex-row items-center flex-1 !mt-0">
                        <div className="focus-visible:outline-none">
                          <Input
                            type="number"
                            min={0}
                            className="flex-1 !m-0 text-end"
                            {...field}
                            onChange={(e) => {
                              form.setValue(
                                "weight",
                                isNaN(e.target.valueAsNumber)
                                  ? 0
                                  : e.target.valueAsNumber,
                                { shouldValidate: false }
                              );
                            }}
                          />
                          <p className="w-8 text-center">KG</p>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Original price</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="flex-1 !m-0 text-end"
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            form.setValue(
                              "originalPrice",
                              isNaN(e.target.valueAsNumber)
                                ? 0
                                : e.target.valueAsNumber,
                              { shouldValidate: true }
                            )
                          }
                          onBlur={updateSameTypeProducts}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productPrice"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Product price</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="flex-1 !m-0 text-end"
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            form.setValue(
                              "productPrice",
                              isNaN(e.target.valueAsNumber)
                                ? 0
                                : e.target.valueAsNumber,
                              { shouldValidate: true }
                            )
                          }
                          onBlur={() => {
                            updatePriceUnits();
                            updateSameTypeProducts();
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Stock</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="flex-1 !m-0 text-end"
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            form.setValue(
                              "stock",
                              isNaN(e.target.valueAsNumber)
                                ? 0
                                : e.target.valueAsNumber,
                              {
                                shouldValidate: true,
                              }
                            )
                          }
                          onBlur={updateSameTypeProducts}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minStock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Min stock</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="flex-1 !m-0 text-end"
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            form.setValue(
                              "minStock",
                              isNaN(e.target.valueAsNumber)
                                ? 0
                                : e.target.valueAsNumber,
                              {
                                shouldValidate: true,
                              }
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxStock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Max stock</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="flex-1 !m-0 text-end"
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            form.setValue(
                              "maxStock",
                              isNaN(e.target.valueAsNumber)
                                ? 0
                                : e.target.valueAsNumber,
                              {
                                shouldValidate: true,
                              }
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Status</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-row"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Active" id="r1" />
                            <Label htmlFor="r1">Active</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Disabled" id="r2" />
                            <Label htmlFor="r2">Disabled</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="my-4">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <div className="flex flex-row gap-2">
                        {field.value
                          ? field.value.map((imageLink, index) => (
                              <ChooseImageButton
                                key={index}
                                file={imageLink}
                                onImageChanged={(newFile: File | null) => {
                                  handleImageChosen(newFile, index);
                                }}
                              />
                            ))
                          : null}
                      </div>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="border rounded-sm mb-4">
              <FormField
                control={form.control}
                name="properties"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="text-sm bg-gray-200 p-3">
                            <div className="flex flex-row gap-10">
                              <p>Product properties</p>
                              <NewProductPropertiesInputErrorFormMessage />
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col">
                              {field.value
                                ? field.value.map((value, index) => {
                                    return (
                                      <div
                                        key={index}
                                        className="flex flex-row items-center gap-2"
                                      >
                                        <Popover>
                                          <PopoverTrigger>
                                            <div className="ml-4 h-[35px] border-b flex flex-row justify-between items-center w-[250px]">
                                              <p className=" p-1 text-start">
                                                {value.key.length === 0
                                                  ? "Choose property..."
                                                  : value.key}
                                              </p>
                                              <Pencil size={16} />
                                            </div>
                                          </PopoverTrigger>
                                          <PopoverContent className="p-0">
                                            {productPropertyChoices.map(
                                              (choice, choiceIndex) => {
                                                return (
                                                  <div
                                                    key={choiceIndex}
                                                    className="p-2 hover:bg-slate-300 rounded-sm hover:cursor-pointer flex flex-row justify-between items-center"
                                                    onClick={() => {
                                                      if (
                                                        field.value![index]
                                                          .key === choice
                                                      ) {
                                                        field.value![
                                                          index
                                                        ].key = "";

                                                        form.setValue(
                                                          "properties",
                                                          [...field.value!]
                                                        );
                                                      } else if (
                                                        !field.value!.every(
                                                          (
                                                            fieldVal,
                                                            fieldIdx
                                                          ) => {
                                                            return (
                                                              fieldVal.key !==
                                                              choice
                                                            );
                                                          }
                                                        )
                                                      ) {
                                                        toast({
                                                          description:
                                                            "Property has already been chosen",
                                                          variant:
                                                            "destructive",
                                                        });
                                                        return;
                                                      } else {
                                                        field.value![
                                                          index
                                                        ].key = choice;

                                                        form.setValue(
                                                          "properties",
                                                          [...field.value!]
                                                        );
                                                      }
                                                      // important
                                                      updateSameTypeProducts();
                                                    }}
                                                  >
                                                    <p className="text-sm">
                                                      {choice}
                                                    </p>
                                                    {value.key === choice ? (
                                                      <Check size={16} />
                                                    ) : null}
                                                  </div>
                                                );
                                              }
                                            )}
                                          </PopoverContent>
                                        </Popover>
                                        <div className="flex flex-row flex-wrap items-center ml-8 flex-1 gap-1">
                                          {value.values.map(
                                            (keyVal, keyIdx) => (
                                              <div
                                                key={keyIdx}
                                                className="flex flex-row p-1 bg-blue-400 text-white rounded-md items-center gap-[2px]"
                                              >
                                                <p>{keyVal}</p>
                                                <X
                                                  size={16}
                                                  color="white"
                                                  className="p-[2px] hover:cursor-pointer"
                                                  onClick={(e) => {
                                                    onProductPropertyValueDelete(
                                                      index,
                                                      keyIdx,
                                                      field.value!
                                                    );

                                                    updateSameTypeProducts();
                                                  }}
                                                />
                                              </div>
                                            )
                                          )}
                                          <Input
                                            placeholder="Type value and enter"
                                            value={
                                              productPropertyInputValues[index]
                                            }
                                            onChange={(e) => {
                                              setProductPropertyInputValues(
                                                (prev) => {
                                                  prev[index] = e.target.value;
                                                  return [...prev];
                                                }
                                              );
                                            }}
                                            onBlur={() =>
                                              updateSameTypeProducts()
                                            }
                                            onKeyDown={(e) => {
                                              onProductPropertyInputKeyDown(
                                                e,
                                                productPropertyInputValues[
                                                  index
                                                ],
                                                field.value!,
                                                index
                                              );
                                              updateSameTypeProducts();
                                            }}
                                            className="h-[35px] w-[200px] rounded-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border-0 border-b"
                                          />
                                        </div>
                                        <Trash
                                          size={16}
                                          className="mr-4 hover:cursor-pointer"
                                          fill="black"
                                          onClick={(e) => {
                                            form.setValue(
                                              "properties",
                                              field.value!.filter(
                                                (_, idx) => idx !== index
                                              )
                                            );
                                            updateSameTypeProducts();
                                            setProductPropertyInputValues(
                                              (prev) =>
                                                prev.filter(
                                                  (_, idx) => idx !== index
                                                )
                                            );
                                          }}
                                        />
                                      </div>
                                    );
                                  })
                                : null}
                            </div>
                            <Button
                              className="border bg-transparent hover:bg-slate-200 ml-4 mt-2 h-[35px]"
                              type="button"
                              onClick={(e) => {
                                let newVal: {
                                  key: string;
                                  values: string[];
                                }[];

                                if (field.value === null)
                                  newVal = [{ key: "", values: [] }];
                                else
                                  newVal = [
                                    ...field.value,
                                    { key: "", values: [] },
                                  ];
                                form.setValue("properties", newVal, {
                                  shouldValidate: false,
                                });
                                setProductPropertyInputValues((prev) => [
                                  ...prev,
                                  "",
                                ]);
                              }}
                            >
                              <Plus size={16} className="mr-2" />
                              Add property
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="border rounded-sm mb-4">
              <FormField
                control={form.control}
                name="units"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="text-sm bg-gray-200 p-3">
                            <div className="flex flex-row gap-10">
                              <p>Product units</p>
                              <NewProductUnitInputErrorFormMessage />
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col">
                              <div className="flex flex-row m-2 ml-4 items-center gap-4">
                                <p>Base unit</p>
                                <Input
                                  value={field.value?.baseUnit}
                                  onChange={(e) => {
                                    form.setValue(
                                      "units",
                                      {
                                        baseUnit: e.target.value,
                                        otherUnits: field.value?.otherUnits,
                                      },
                                      { shouldValidate: true }
                                    );
                                  }}
                                  onBlur={updateSameTypeProducts}
                                />
                              </div>
                              {field.value?.otherUnits
                                ? field.value.otherUnits.map((value, index) => {
                                    return (
                                      <ProductNewUnitView
                                        key={index}
                                        unitName={value.unitName}
                                        price={value.price}
                                        exchangeValue={value.exchangeValue}
                                        onUnitNameBlur={updateSameTypeProducts}
                                        onExchangeValueBlur={() => {
                                          updatePriceUnits();
                                          updateSameTypeProducts();
                                        }}
                                        onPriceBlur={() => {
                                          updatePriceUnit(value.price, index);
                                          updateSameTypeProducts();
                                        }}
                                        onUnitNameChanged={(val: string) => {
                                          const newObj = {
                                            ...field.value!.otherUnits![index],
                                            unitName: val,
                                          };
                                          field.value!.otherUnits![index] =
                                            newObj;
                                          form.setValue(
                                            "units.otherUnits",
                                            [...field.value!.otherUnits!],

                                            { shouldValidate: true }
                                          );
                                        }}
                                        onPriceChanged={(val: number) => {
                                          const newObj = {
                                            ...field.value!.otherUnits![index],
                                            price: val,
                                          };
                                          field.value!.otherUnits![index] =
                                            newObj;
                                          form.setValue(
                                            "units",
                                            {
                                              baseUnit: field.value!.baseUnit,
                                              otherUnits: [
                                                ...field.value!.otherUnits!,
                                              ],
                                            },
                                            { shouldValidate: true }
                                          );
                                        }}
                                        onExchangeValueChanged={(
                                          val: number
                                        ) => {
                                          const newObj = {
                                            ...field.value!.otherUnits![index],
                                            exchangeValue: val,
                                          };
                                          field.value!.otherUnits![index] =
                                            newObj;
                                          form.setValue(
                                            "units",
                                            {
                                              baseUnit: field.value!.baseUnit,
                                              otherUnits: [
                                                ...field.value!.otherUnits!,
                                              ],
                                            },
                                            { shouldValidate: true }
                                          );
                                        }}
                                        onRemoveClick={() => {
                                          form.setValue(
                                            "units",
                                            {
                                              baseUnit: field.value!.baseUnit,
                                              otherUnits:
                                                field.value!.otherUnits!.filter(
                                                  (_, idx) => idx !== index
                                                ),
                                            },
                                            { shouldValidate: false }
                                          );
                                        }}
                                      />
                                    );
                                  })
                                : null}
                            </div>
                            <Button
                              type="button"
                              className="border bg-transparent hover:bg-slate-200 ml-4 mt-2 h-[35px]"
                              onClick={(e) => {
                                e.preventDefault();
                                if (
                                  field.value === undefined ||
                                  field.value.baseUnit.length === 0
                                ) {
                                  form.setError(
                                    "units",
                                    { message: "Please specify base unit!" },
                                    { shouldFocus: true }
                                  );
                                  return;
                                }

                                const newUnit = {
                                  unitName: "",
                                  exchangeValue: 1,
                                  price: form.getValues("productPrice"),
                                };

                                const newVal =
                                  field.value!.otherUnits === undefined
                                    ? [newUnit]
                                    : [...field.value!.otherUnits!, newUnit];
                                form.setValue("units", {
                                  baseUnit: field.value!.baseUnit,
                                  otherUnits: newVal,
                                });
                              }}
                            >
                              <Plus size={16} className="mr-2" />
                              Add unit
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="sameTypeProducts"
              render={({ field }) => {
                if (!field.value || field.value.length === 0) return <></>;
                return (
                  <FormItem className="flex flex-col space-y-0 mb-4">
                    <FormLabel className="text-black justify-center text-sm bg-gray-200 p-3 rounded-t-sm">
                      <h5 className="text-sm">Same type products</h5>
                      <FormMessage className="mr-2 text-xs" />
                    </FormLabel>
                    <FormControl>
                      <div className="border rounded-b-sm pb-2">
                        <SameTypeProductView
                          properties={field.value
                            .filter((val) => val.properties !== undefined)
                            .map((val) => val.properties!)}
                          unit={field.value
                            .filter((val) => val.unit !== undefined)
                            .map((val) => val.unit.name!)}
                          originalPrice={field.value.map(
                            (val) => val.originalPrice
                          )}
                          productPrice={field.value.map(
                            (val) => val.productPrice
                          )}
                          stock={field.value.map((val) => val.stock)}
                          onOriginalPriceChanged={(val, index) => {
                            field.value[index].originalPrice = val;
                            form.setValue("sameTypeProducts", [...field.value]);
                          }}
                          onProductPriceChanged={(val, index) => {
                            field.value[index].productPrice = val;
                            form.setValue("sameTypeProducts", [...field.value]);
                          }}
                          onStockChanged={(val, index) => {
                            field.value[index].stock = val;
                            form.setValue("sameTypeProducts", [...field.value]);
                          }}
                          onRemoveClick={(index) => {
                            field.value.splice(index, 1);
                            form.setValue("sameTypeProducts", [...field.value]);
                          }}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <div className="border rounded-sm mb-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-black justify-center text-sm bg-gray-200 p-3">
                      <h5 className="text-sm">Description</h5>
                      <FormMessage className="mr-2 text-xs" />
                    </FormLabel>
                    <FormControl className="border-none">
                      <Textarea
                        className="flex-1 resize-none p-2 !mt-0 min-h-[100px] !rounded-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                        onKeyDown={(e) => e.stopPropagation()}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="border rounded-sm mb-4">
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-black justify-center text-sm bg-gray-200 p-3">
                      <h5 className="text-sm">Note</h5>
                      <FormMessage className="mr-2 text-xs" />
                    </FormLabel>
                    <FormControl className="border-none">
                      <Textarea
                        className="flex-1 resize-none  p-2 !mt-0 min-h-[100px] !rounded-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row gap-8">
              <div className="flex-1" />
              <Button
                variant={"green"}
                type="submit"
                className="px-4 min-w-[150px] uppercase"
              >
                Save
                <LoadingCircle
                  className={
                    "!w-4 ml-4 " + (isCreatingNewProduct ? "" : "hidden")
                  }
                />
              </Button>
              <Button
                variant={"green"}
                type="button"
                className="px-4 min-w-[150px] bg-gray-400 hover:bg-gray-500 uppercase"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onChangeVisibility(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

const ProductNewUnitView = ({
  unitName,
  exchangeValue,
  price,
  onUnitNameChanged,
  onUnitNameBlur,
  onExchangeValueChanged,
  onExchangeValueBlur,
  onPriceChanged,
  onPriceBlur,
  onRemoveClick,
}: {
  unitName: string;
  exchangeValue: number;
  price: number;
  onUnitNameChanged: (val: string) => void;
  onUnitNameBlur: () => void;
  onExchangeValueChanged: (val: number) => void;
  onExchangeValueBlur: () => void;
  onPriceChanged: (val: number) => void;
  onPriceBlur: () => void;
  onRemoveClick: () => void;
}) => {
  return (
    <div className="flex flex-row items-center gap-4 text-[0.85rem] ml-4 mb-2">
      <div className="flex flex-col flex-1">
        <p className="font-semibold">Unit name</p>
        <input
          value={unitName}
          onChange={(e) => onUnitNameChanged(e.target.value)}
          className="border-b border-blue-300 p-1"
          onBlur={onUnitNameBlur}
        />
      </div>
      <div className="flex flex-col flex-1">
        <p className="font-semibold">Exchange value</p>
        <input
          type="number"
          min={0}
          value={exchangeValue}
          onChange={(e) => onExchangeValueChanged(e.target.valueAsNumber)}
          onBlur={onExchangeValueBlur}
          className="border-b border-blue-300 p-1 text-end"
        />
      </div>
      <div className="flex flex-col flex-1">
        <p className="font-semibold">Price</p>
        <input
          value={price}
          type="number"
          min={0}
          onChange={(e) => onPriceChanged(e.target.valueAsNumber)}
          onBlur={onPriceBlur}
          className="border-b border-blue-300 p-1 text-end"
        />
      </div>
      <Trash
        size={16}
        className="mr-4 hover:cursor-pointer"
        fill="black"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemoveClick();
        }}
      />
    </div>
  );
};

const SameTypeProductView = ({
  properties,
  unit,
  originalPrice,
  productPrice,
  stock,
  onOriginalPriceChanged,
  onProductPriceChanged,
  onStockChanged,
  onRemoveClick,
}: {
  properties: Record<string, string>[];
  unit: string[];
  originalPrice: number[];
  productPrice: number[];
  stock: number[];
  onOriginalPriceChanged: (val: number, index: number) => void;
  onProductPriceChanged: (val: number, index: number) => void;
  onStockChanged: (val: number, index: number) => void;
  onRemoveClick: (index: number) => void;
}) => {
  return (
    <div className="flex flex-col items-center gap-3 text-[0.8rem] p-1 w-full">
      <div className="flex flex-row w-full gap-2">
        <p className="font-semibold text-center flex-1">Property</p>
        <p className="font-semibold text-center flex-1">Unit</p>
        <p className="font-semibold text-center flex-1">Original price</p>
        <p className="font-semibold text-center flex-1">Product price</p>
        <p className="font-semibold text-center flex-1">Stock</p>
        <div className="w-[50px]" /> {/* for trash bin*/}
      </div>
      {originalPrice.map((_, idx) => {
        return (
          <div
            key={idx}
            className="flex flex-row w-full gap-2 items-center justify-center"
          >
            {(() => {
              let str = "";
              if (properties && properties[idx])
                Object.entries(properties[idx]).forEach((v, i) => {
                  if (i !== Object.entries(properties[idx]).length - 1)
                    str += v[0] + " - " + v[1] + ", ";
                  else str += v[0] + " - " + v[1];
                });
              return (
                <div className="flex-1 basis-0">
                  <p>{str}</p>
                </div>
              );
            })()}
            {(() => {
              return (
                <div className="flex-1 basis-0 text-center">
                  <p>{unit && unit[idx] ? unit[idx] : ""}</p>
                </div>
              );
            })()}
            {(() => {
              return (
                <input
                  value={originalPrice[idx]}
                  type="number"
                  min={0}
                  onChange={(e) =>
                    onOriginalPriceChanged(e.target.valueAsNumber, idx)
                  }
                  className="border-b border-blue-300 p-1 text-end flex-1 min-w-[0px]"
                />
              );
            })()}
            {(() => {
              return (
                <input
                  value={productPrice[idx]}
                  type="number"
                  min={0}
                  onChange={(e) =>
                    onProductPriceChanged(e.target.valueAsNumber, idx)
                  }
                  className="border-b border-blue-300 p-1 text-end flex-1 min-w-[0px]"
                />
              );
            })()}
            {(() => {
              return (
                <input
                  value={stock[idx]}
                  type="number"
                  min={0}
                  onChange={(e) => onStockChanged(e.target.valueAsNumber, idx)}
                  className="border-b border-blue-300 p-1 text-end flex-1 min-w-[0px]"
                />
              );
            })()}
            <Trash
              size={16}
              className="hover:cursor-pointer w-[50px]"
              fill="black"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemoveClick(idx);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

const NewProductPropertiesInputErrorFormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();

  if (!error) {
    return null;
  }

  let message: string = "";
  let customError: any = error;
  for (let i = 0; i < customError.length; i++) {
    if (customError[i] === undefined) continue;
    else {
      message = customError[i].key.message || customError[i].values.message;
      break;
    }
  }

  if (!message || message.length === 0)
    message = "Something went wrong, try later!";

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  );
});
NewProductPropertiesInputErrorFormMessage.displayName = "FormMessage";

const NewProductUnitInputErrorFormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();

  if (!error) {
    return null;
  }

  let message: string = "";
  let customError: any = error;
  if (customError.message) message = customError.message;
  else if (customError.baseUnit) message = customError.baseUnit.message;
  else {
    for (let i = 0; i < customError.otherUnits.length; i++) {
      if (customError.otherUnits[i] === undefined) continue;
      else {
        message = customError.otherUnits[i].unitName
          ? customError.otherUnits[i].unitName.message
          : customError.otherUnits[i].exchangeValue
          ? customError.otherUnits[i].exchangeValue.message
          : customError.otherUnits[i].price.message;
        break;
      }
    }
  }

  if (!message || message.length === 0)
    message = "Something went wrong, try later!";

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  );
});
NewProductUnitInputErrorFormMessage.displayName = "FormMessage";

const onAddNewLocation = (value: string) => {
  CatalogService.createNewLocation(value).then();
};

const AddNewThing = ({
  title,
  placeholder,
  open,
  onOpenChange,
  onAddClick,
}: {
  title: string;
  placeholder: string;
  open: boolean;
  onOpenChange: (value: boolean) => any;
  onAddClick: (value: string) => Promise<any>;
}) => {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger>
        <PlusCircle size={16} className="mx-2" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <div className="flex flex-row items-center text-sm gap-3 !my-4">
            <label htmlFor="alert_input" className="font-semibold w-36">
              {placeholder}
            </label>
            <input
              id="alert_input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 rounded-sm border p-1"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={
              "bg-red-400 hover:bg-red-500 text-white hover:text-white"
            }
            disabled={isLoading}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-green-500 hover:bg-green-600 text-white hover:text-white"
            onClick={(e) => {
              setIsLoading(true);
              onAddClick(value).finally(() => {
                setIsLoading(false);
                onOpenChange(false);
              });
            }}
            disabled={isLoading}
          >
            Done
            {isLoading ? <LoadingCircle /> : null}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

type CartesianResult = Record<string, string>;
function cartesian(
  input: { values: string[]; key: string }[]
): CartesianResult[] {
  const inputObj: Record<string, any[]> = {};
  input.forEach((value) => {
    inputObj[value.key] = value.values;
  });

  const keys = Object.keys(inputObj);
  const r: CartesianResult[] = [];
  const max: number = keys.length - 1;

  function helper(obj: Record<string, any>, i: number): void {
    const currentKey = keys[i];
    const currentArray = inputObj[currentKey];

    for (let j = 0, l = currentArray.length; j < l; j++) {
      const newObj = { ...obj, [currentKey]: currentArray[j] };
      if (i === max) {
        r.push(newObj as CartesianResult);
      } else {
        helper(newObj, i + 1);
      }
    }
  }

  helper({}, 0);
  return r;
}

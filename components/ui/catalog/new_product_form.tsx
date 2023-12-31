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
import ProductService from "@/services/productService";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { Label } from "../label";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import {
  Product,
  ProductBrand,
  ProductGroup,
  ProductLocation,
  ProductProperty,
} from "@/entities/Product";
import LoadingCircle from "../loading_circle";
import { useAppSelector } from "@/hooks";
import { faker } from "@faker-js/faker";
import AddNewThing from "../add_new_thing_dialog";
import { formatDecimalInput, formatPrice, formatNumberInput } from "@/utils";
import { useRouter } from "next/navigation";

const newProductFormSchema = z.object({
  barcode: z
    .string({ required_error: "Barcode is missing" })
    .trim()
    .min(0, { message: "Barcode is missing!" })
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
  productBrand: z.string().trim().nullable(),
  location: z
    .string()
    .max(100, "Location must be at most 100 characters")
    .nullable(),
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
  productProperties: z
    .array(
      z.object({
        id: z.number(),
        key: z.string().min(1, "Missing property name!"),
        values: z.array(z.string()).min(1, "Propety needs at least 1 value"),
      }),
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
            .min(0, { message: "Exchange value must be at least 0" })
            .max(Number.MAX_VALUE, {
              message: `Exchange value must be lest than ${Number.MAX_VALUE}`,
            }),
          originalPrice: z
            .number({ required_error: "Missing original price!" })
            .min(0, { message: "Original price must be at least 0" })
            .max(Number.MAX_VALUE, {
              message: `Original price must be less than ${Number.MAX_VALUE}`,
            }),
          price: z
            .number({ required_error: "Missing price!" })
            .min(0, { message: "Price must be at least 0" })
            .max(Number.MAX_VALUE, {
              message: `Price must be less than ${Number.MAX_VALUE}`,
            }),
        }),
      )
      .optional(),
  }),
  description: z.string(),
  note: z.string(),
  sameTypeProducts: z.array(
    z.object({
      productProperties: z.record(z.string(), z.string()).optional(),
      unit: z.object({
        basicUnit: z.string(),
        name: z.string(),
        exchangeValue: z.number(),
      }),
      barcode: z
        .string({ required_error: "Barcode is missing" })
        .trim()
        .min(0, { message: "Barcode is missing!" })
        .max(50, { message: "Barcode must be at most 50 characters!" }),
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
    }),
  ),
});

export const NewProductView = ({
  onChangeVisibility,
  onNewProductsAdded,
  addNewLocation,
  addNewGroup,
  addNewBrand,
  addNewProperty,
  onUpdateProperty,
  onDeleteProperty,
}: {
  onChangeVisibility: (val: boolean) => any;
  onNewProductsAdded: (products: Product[]) => any;
  addNewLocation: (value: string) => any;
  addNewGroup: (value: string) => any;
  addNewBrand: (value: string) => any;
  addNewProperty: (value: string) => any;
  onUpdateProperty: (value: string, index: number) => any;
  onDeleteProperty: (deletePropertyId: number) => any;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const productLocationChoices = useAppSelector(
    (state) => state.productLocations.value,
  );
  const productGroupChoices = useAppSelector(
    (state) => state.productGroups.value,
  );
  const productBrandChoices = useAppSelector(
    (state) => state.productBrands.value,
  );
  const productPropertyChoices = useAppSelector(
    (state) => state.productProperties.value,
  );
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
      location: null,
      originalPrice: undefined,
      productPrice: undefined,
      status: "Active",
      stock: undefined,
      weight: undefined,
      minStock: undefined,
      maxStock: 999999999,
      images: [null, null, null, null, null],
      productProperties: null,
      units: {
        baseUnit: "",
        otherUnits: undefined,
      },
      description: "",
      note: "",
    },
  });

  // const updatePriceUnit = (value: number, index: number) => {
  //   const units = form.getValues("units.otherUnits");
  //   if (!units) return;

  //   const newUnits = units.map((val, idx) =>
  //     idx === index ? { ...val, price: value } : val
  //   );

  //   const newFormUnits = {
  //     baseUnit: form.getValues("units.baseUnit"),
  //     otherUnits: newUnits,
  //   };

  //   updateSameTypeProducts({
  //     ...form.getValues(),
  //     units: newFormUnits,
  //   });

  //   form.setValue("units", newFormUnits);
  // };

  const updatePriceUnits = () => {
    const units = form.getValues("units.otherUnits");
    const productPrice = form.getValues("productPrice");
    const originalPrice = form.getValues("originalPrice");
    if (!units || !productPrice || !originalPrice) return;

    const newUnits = units.map((val) => ({
      ...val,
      originalPrice: originalPrice * val.exchangeValue,
      price: productPrice * val.exchangeValue,
    }));

    const newFormUnits = {
      baseUnit: form.getValues("units.baseUnit"),
      otherUnits: newUnits,
    };

    form.setValue("units", newFormUnits);

    const formData = { ...form.getValues() };
    formData.units = newFormUnits;
    updateSameTypeProducts(formData);
  };

  const updateSameTypeProducts = (newFormData: any) => {
    let properties = newFormData.productProperties;
    let units = newFormData.units ? newFormData.units.otherUnits : null;
    const baseUnit = newFormData.units ? newFormData.units.baseUnit : null;
    let propertiesLength = 1;
    let unitsLength = 1;

    if (properties) {
      properties = properties.filter(
        (pro: any) => pro.key.length > 0 && pro.values.length > 0,
      );
      properties.forEach((pro: any) => {
        if (pro.values.length > 0) propertiesLength *= pro.values.length;
      });
    }

    if (units) {
      units = units.filter((unit: any) => unit.unitName.length > 0);
      unitsLength += units.length;
    }

    if (propertiesLength * unitsLength <= 1) {
      form.setValue("sameTypeProducts", []);
      return;
    }

    const originalPrice = newFormData.originalPrice;
    const productPrice = newFormData.productPrice;
    const stock = newFormData.stock;
    const barcode = newFormData.barcode;

    const sameTypeProducts: any[] = [];

    if (properties && properties.length > 0) {
      const propertyCombinations = cartesian(properties);
      propertyCombinations.forEach((combination) => {
        sameTypeProducts.push({
          originalPrice: originalPrice,
          productPrice: productPrice,
          stock: stock,
          productProperties: combination,
        });
      });
    }

    if (sameTypeProducts.length === 0) {
      sameTypeProducts.push({
        originalPrice: originalPrice,
        productPrice: productPrice,
        stock: stock,
        barcode: barcode,
        unit: {
          basicUnit: baseUnit,
          name: baseUnit,
          exchangeValue: 1,
        },
      });
    } else {
      sameTypeProducts.forEach((product) => {
        product["barcode"] = "";
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
        originalPrice: units![i].originalPrice,
        productPrice: units![i].price,
      }));
      sameTypeProducts.push(...newProducts);
    }
    sameTypeProducts[0].barcode = barcode;
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
      { shouldValidate: true },
    );
    setChosenImageFiles(chosenImageFiles);
  };

  function onProductPropertyInputKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string,
    fieldValue: {
      id: number;
      values: string[];
      key: string;
    }[],
    index: number,
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
        const newFormData = {
          ...form.getValues(),
          productProperties: newValue,
        };
        updateSameTypeProducts(newFormData);
        form.setValue("productProperties", newValue);
      }
    }
  }

  function onProductPropertyValueDelete(
    index: number,
    deleteIndex: number,
    fieldValue: { id: number; values: string[]; key: string }[],
  ) {
    fieldValue[index].values.splice(deleteIndex, 1);

    const newFormData = {
      ...form.getValues(),
      productProperties: [...fieldValue],
    };
    updateSameTypeProducts(newFormData);
    form.setValue("productProperties", [...fieldValue]);
  }

  function onSubmit(values: z.infer<typeof newProductFormSchema>) {
    delete values.images; // get images from chosenImages
    let data: any[] = [];

    if (values.sameTypeProducts.length === 0) {
      data.push({
        ...values,
        barcode: values.barcode
          ? values.barcode
          : faker.number.int({ min: 100000000000, max: 999999999999 }),
        productProperties: values.productProperties?.map((propertyObj) => ({
          propertyName: propertyObj.key,
          propertyValue: propertyObj.values[0],
        })),
        salesUnits: {
          basicUnit: values.units.baseUnit,
          name: values.units.baseUnit,
          exchangeValue: 1,
        },
      });
      if (data[0].units) delete data[0].units;
      delete data[0].sameTypeProducts;
    } else {
      data = values.sameTypeProducts.map((sameProduct) => {
        const newElement: any = {
          ...values,
          originalPrice: sameProduct.originalPrice,
          productPrice: sameProduct.productPrice,
          stock: sameProduct.stock,
          barcode: sameProduct.barcode
            ? sameProduct.barcode
            : faker.number.int({ min: 100000000000, max: 999999999999 }),
          productProperties: sameProduct.productProperties
            ? Object.entries(sameProduct.productProperties).map((val) => ({
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
      new Blob([JSON.stringify(data)], { type: "application/json" }),
    );

    chosenImageFiles
      .filter((file) => file != null)
      .forEach((imageFile) => dataForm.append("files", imageFile));

    setIsCreatingNewProduct(true);
    ProductService.createNewProduct(dataForm)
      .then((result) => {
        onNewProductsAdded(result.data);
        onChangeVisibility(false);
      })
      .catch((e) => axiosUIErrorHandler(e, toast, router))
      .finally(() => {
        setIsCreatingNewProduct(false);
      });
  }

  return (
    <div className="fixed left-0 top-0 z-[10] flex h-screen w-screen items-center justify-center bg-black bg-opacity-30">
      <div
        className={cn(
          "flex max-h-[95%] w-[95%] max-w-[960px] flex-col overflow-y-auto rounded-md bg-white p-4",
          scrollbar_style.scrollbar,
        )}
      >
        <div className="mb-4 flex flex-row items-center justify-between">
          <h3 className="text-base font-semibold">Add new product</h3>
          <X
            size={24}
            className="rounded-full p-1 hover:cursor-pointer hover:bg-slate-200"
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
            <div className="flex h-full w-full flex-col md:flex-row md:gap-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Barcode</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="!m-0 flex-1"
                          {...field}
                          onBlur={() =>
                            updateSameTypeProducts(form.getValues())
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Product name</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input className="!m-0 flex-1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productGroup"
                  render={({ field }) => (
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Product group</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <div className="!m-0 flex min-h-[40px] flex-1 flex-row items-center rounded-md border border-input">
                          <div className="h-full w-full flex-1">
                            <SearchAndChooseButton
                              value={field.value}
                              placeholder="---Choose group---"
                              searchPlaceholder="Search product..."
                              onValueChanged={(val) => {
                                form.setValue(
                                  "productGroup",
                                  val === null ? "" : val,
                                  { shouldValidate: true },
                                );
                              }}
                              choices={productGroupChoices.map((v) => v.name)}
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
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Product brand</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <div className="!m-0 flex min-h-[40px] flex-1 flex-row items-center rounded-md border border-input">
                          <div className="h-full w-full flex-1">
                            <SearchAndChooseButton
                              value={field.value}
                              placeholder="---Choose brand---"
                              searchPlaceholder="Search brand..."
                              onValueChanged={(val) => {
                                form.setValue("productBrand", val, {
                                  shouldValidate: true,
                                });
                              }}
                              choices={productBrandChoices.map((v) => v.name)}
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
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Location</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <div className="!m-0 flex min-h-[40px] flex-1 flex-row items-center rounded-md border border-input">
                          <div className="h-full w-full flex-1">
                            <SearchAndChooseButton
                              value={field.value}
                              placeholder="---Choose location---"
                              searchPlaceholder="Search location..."
                              onValueChanged={(val) => {
                                form.setValue("location", val, {
                                  shouldValidate: true,
                                });
                              }}
                              choices={productLocationChoices.map(
                                (v) => v.name,
                              )}
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
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Weight</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl className="!mt-0 flex flex-1 flex-row items-center">
                        <div className="focus-visible:outline-none">
                          <Input
                            min={0}
                            placeholder="0"
                            className="!m-0 flex-1 text-end"
                            onChange={(e) => {
                              const number = formatDecimalInput(e);
                              form.setValue(
                                "weight",
                                isNaN(number)
                                  ? 0
                                  : number,
                                { shouldValidate: false },
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
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Original price</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="!m-0 flex-1 text-end"
                          placeholder="0"
                          defaultValue={field.value}
                          onChange={(e) => {
                            const number = formatNumberInput(e);
                            form.setValue(
                              "originalPrice",
                              isNaN(number) ? 0 : number,
                              { shouldValidate: true },
                            );
                          }}
                          onBlur={() =>
                            updateSameTypeProducts(form.getValues())
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productPrice"
                  render={({ field }) => (
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Product price</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="!m-0 flex-1 text-end"
                          placeholder="0"
                          defaultValue={field.value}
                          onChange={(e) => {
                            const number = formatNumberInput(e);
                            form.setValue(
                              "productPrice",
                              isNaN(number) ? 0 : number,
                              { shouldValidate: true },
                            );
                          }}
                          onBlur={updatePriceUnits}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Stock</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="!m-0 flex-1 text-end"
                          placeholder="0"
                          defaultValue={field.value}
                          onChange={(e) => {
                            const number = formatNumberInput(e);
                            form.setValue("stock", isNaN(number) ? 0 : number, {
                              shouldValidate: true,
                            });
                          }}
                          onBlur={() =>
                            updateSameTypeProducts(form.getValues())
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minStock"
                  render={({ field }) => (
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Min stock</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="!m-0 flex-1 text-end"
                          placeholder="0"
                          defaultValue={field.value}
                          onChange={(e) => {
                            const number = formatNumberInput(e);
                            form.setValue(
                              "minStock",
                              isNaN(number) ? 0 : number,
                              { shouldValidate: true },
                            );
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxStock"
                  render={({ field }) => (
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Max stock</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="!m-0 flex-1 text-end"
                          defaultValue={formatPrice(field.value)}
                          onChange={(e) => {
                            const number = formatNumberInput(e);
                            form.setValue(
                              "maxStock",
                              isNaN(number) ? 0 : number,
                              { shouldValidate: true },
                            );
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
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
                                fileUrl={imageLink}
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
            <div className="mb-4 rounded-sm border">
              <FormField
                control={form.control}
                name="productProperties"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="bg-gray-200 p-3 text-sm">
                            <div className="flex flex-row gap-10">
                              <p>Product properties</p>
                              <NewProductPropertiesInputErrorFormMessage />
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-2">
                            <div className="flex flex-col">
                              {field.value
                                ? field.value.map((value, index) => {
                                    return (
                                      <div
                                        key={index}
                                        className="flex flex-row items-center gap-2"
                                      >
                                        <Popover>
                                          <PopoverTrigger className="w-[150px]">
                                            {!value.key ||
                                            value.key.length === 0 ? (
                                              <>
                                                <p className=" p-1 text-start">
                                                  Choose property...
                                                </p>
                                              </>
                                            ) : (
                                              <div className="flex flex-row items-center justify-between">
                                                <p className=" p-1 text-start">
                                                  {value.key}
                                                </p>
                                                <UpdatePropertyView
                                                  property={value}
                                                  onDeleteClick={
                                                    onDeleteProperty
                                                  }
                                                  onUpdateClick={
                                                    onUpdateProperty
                                                  }
                                                  onUpdateSuccess={(
                                                    newVal,
                                                    valId,
                                                  ) => {
                                                    const newValue =
                                                      field.value!.map((v) =>
                                                        v.id === valId
                                                          ? {
                                                              ...v,
                                                              key: newVal,
                                                            }
                                                          : v,
                                                      );

                                                    form.setValue(
                                                      "productProperties",
                                                      newValue,
                                                    );
                                                  }}
                                                  onDeleteSuccess={(
                                                    propertyId,
                                                  ) => {
                                                    form.setValue(
                                                      "productProperties",
                                                      field.value!.filter(
                                                        (v) =>
                                                          v.id !== propertyId,
                                                      ),
                                                    );
                                                  }}
                                                ></UpdatePropertyView>
                                              </div>
                                            )}
                                          </PopoverTrigger>
                                          <PopoverContent
                                            className={cn(
                                              "max-h-[200px] overflow-auto p-0",
                                              scrollbar_style.scrollbar,
                                            )}
                                          >
                                            {productPropertyChoices.length ===
                                            0 ? (
                                              <div className="flex flex-row items-center justify-between rounded-sm p-2 hover:bg-slate-300">
                                                <p className="select-none text-sm">
                                                  No properties!
                                                </p>
                                              </div>
                                            ) : (
                                              productPropertyChoices.map(
                                                (choice, choiceIndex) => {
                                                  return (
                                                    <div
                                                      key={choiceIndex}
                                                      className="flex flex-row items-center justify-between rounded-sm p-2 hover:cursor-pointer hover:bg-slate-300"
                                                      onClick={() => {
                                                        let newFormProperties: any;
                                                        if (
                                                          field.value![index]
                                                            .key === choice.name
                                                        ) {
                                                          field.value![
                                                            index
                                                          ].key = "";
                                                          newFormProperties = [
                                                            ...field.value!,
                                                          ];

                                                          form.setValue(
                                                            "productProperties",
                                                            newFormProperties,
                                                          );
                                                        } else if (
                                                          !field.value!.every(
                                                            (
                                                              fieldVal,
                                                              fieldIdx,
                                                            ) => {
                                                              return (
                                                                fieldVal.key !==
                                                                choice.name
                                                              );
                                                            },
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
                                                          ].key = choice.name;
                                                          newFormProperties = [
                                                            ...field.value!,
                                                          ];

                                                          form.setValue(
                                                            "productProperties",
                                                            newFormProperties,
                                                          );
                                                        }
                                                        // important
                                                        const newFormData = {
                                                          ...form.getValues(),
                                                          productProperties:
                                                            newFormProperties,
                                                        };
                                                        updateSameTypeProducts(
                                                          newFormData,
                                                        );
                                                      }}
                                                    >
                                                      <p className="text-sm">
                                                        {choice.name}
                                                      </p>
                                                      {value.key ===
                                                      choice.name ? (
                                                        <Check size={16} />
                                                      ) : null}
                                                    </div>
                                                  );
                                                },
                                              )
                                            )}
                                          </PopoverContent>
                                        </Popover>
                                        <div className="ml-8 flex flex-1 flex-row flex-wrap items-center gap-1">
                                          {value.values.map(
                                            (keyVal, keyIdx) => (
                                              <div
                                                key={keyIdx}
                                                className="flex flex-row items-center gap-[2px] rounded-md bg-blue-400 p-1 text-white"
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
                                                      field.value!,
                                                    );
                                                  }}
                                                />
                                              </div>
                                            ),
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
                                                },
                                              );
                                            }}
                                            onBlur={() =>
                                              updateSameTypeProducts(
                                                form.getValues(),
                                              )
                                            }
                                            onKeyDown={(e) => {
                                              onProductPropertyInputKeyDown(
                                                e,
                                                productPropertyInputValues[
                                                  index
                                                ],
                                                field.value!,
                                                index,
                                              );
                                            }}
                                            className="h-[35px] w-[200px] rounded-none border-0 border-b focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                          />
                                        </div>
                                        <Trash
                                          size={16}
                                          className="mr-1 hover:cursor-pointer"
                                          fill="black"
                                          onClick={(e) => {
                                            const newProperties =
                                              field.value!.filter(
                                                (_, idx) => idx !== index,
                                              );

                                            form.setValue(
                                              "productProperties",
                                              newProperties,
                                            );
                                            setProductPropertyInputValues(
                                              (prev) =>
                                                prev.filter(
                                                  (_, idx) => idx !== index,
                                                ),
                                            );

                                            updateSameTypeProducts({
                                              ...form.getValues(),
                                              productProperties: newProperties,
                                            });
                                          }}
                                        />
                                      </div>
                                    );
                                  })
                                : null}
                            </div>
                            <div className="flex flex-row">
                              <Button
                                variant={"green"}
                                className="ml-1 mt-2 h-[35px] border"
                                type="button"
                                onClick={(e) => {
                                  let newVal: {
                                    id: number;
                                    key: string;
                                    values: string[];
                                  }[];

                                  if (field.value === null)
                                    newVal = [
                                      { id: 123123, key: "", values: [] },
                                    ];
                                  else
                                    newVal = [
                                      ...field.value,
                                      { id: 123123, key: "", values: [] },
                                    ];
                                  form.setValue("productProperties", newVal, {
                                    shouldValidate: false,
                                  });
                                  setProductPropertyInputValues((prev) => [
                                    ...prev,
                                    "",
                                  ]);
                                }}
                              >
                                <Plus size={16} className="mr-2" />
                                New property
                              </Button>
                              <ButtonAddNewThing
                                triggerTitle="Add property"
                                title="Add new property"
                                placeholder="Property's name"
                                open={openProperty}
                                onOpenChange={setOpenProperty}
                                onAddClick={addNewProperty}
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-4 rounded-sm border">
              <FormField
                control={form.control}
                name="units"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="bg-gray-200 p-3 text-sm">
                            <div className="flex flex-row gap-10">
                              <p>Product units</p>
                              <NewProductUnitInputErrorFormMessage />
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col">
                              <div className="m-2 ml-4 flex flex-row items-center gap-4">
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
                                      { shouldValidate: true },
                                    );
                                  }}
                                  onBlur={() =>
                                    updateSameTypeProducts(form.getValues())
                                  }
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
                                        originalPrice={value.originalPrice}
                                        onUnitNameBlur={() =>
                                          updateSameTypeProducts(
                                            form.getValues(),
                                          )
                                        }
                                        onExchangeValueBlur={() =>
                                          updatePriceUnits()
                                        }
                                        onPriceBlur={() => updatePriceUnits()}
                                        onOriginalPriceBlur={() =>
                                          updatePriceUnits()
                                        }
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

                                            { shouldValidate: true },
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
                                            { shouldValidate: true },
                                          );
                                        }}
                                        onOriginalPriceChanged={(
                                          val: number,
                                        ) => {
                                          const newObj = {
                                            ...field.value!.otherUnits![index],
                                            originalPrice: val,
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
                                            { shouldValidate: true },
                                          );
                                        }}
                                        onExchangeValueChanged={(
                                          val: number,
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
                                            { shouldValidate: true },
                                          );
                                        }}
                                        onRemoveClick={() => {
                                          const newUnits = {
                                            baseUnit: field.value!.baseUnit,
                                            otherUnits:
                                              field.value!.otherUnits!.filter(
                                                (_, idx) => idx !== index,
                                              ),
                                          };
                                          form.setValue("units", newUnits, {
                                            shouldValidate: false,
                                          });
                                          updateSameTypeProducts({
                                            ...form.getValues(),
                                            units: newUnits,
                                          });
                                        }}
                                      />
                                    );
                                  })
                                : null}
                            </div>
                            <Button
                              variant={"green"}
                              type="button"
                              className="ml-4 mt-2 h-[35px] border"
                              onClick={(e) => {
                                e.preventDefault();
                                if (
                                  field.value === undefined ||
                                  field.value.baseUnit.length === 0
                                ) {
                                  form.setError(
                                    "units",
                                    { message: "Please specify base unit!" },
                                    { shouldFocus: true },
                                  );
                                  return;
                                }

                                const newUnit = {
                                  unitName: "",
                                  exchangeValue: 1,
                                  originalPrice:
                                    form.getValues("originalPrice"),
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
                  <FormItem className="mb-4 flex flex-col space-y-0">
                    <FormLabel className="justify-center rounded-t-sm bg-gray-200 p-3 text-sm text-black">
                      <h5 className="text-sm">Same type products</h5>
                      <FormMessage className="mr-2 text-xs" />
                    </FormLabel>
                    <FormControl>
                      <div className="rounded-b-sm border pb-2">
                        <SameTypeProductView
                          properties={field.value
                            .filter(
                              (val) => val.productProperties !== undefined,
                            )
                            .map((val) => val.productProperties!)}
                          units={field.value
                            .filter((val) => val.unit !== undefined)
                            .map((val) => val.unit.name!)}
                          originalPrices={field.value.map(
                            (val) => val.originalPrice,
                          )}
                          productPrices={field.value.map(
                            (val) => val.productPrice,
                          )}
                          barcodes={field.value.map((val) => val.barcode)}
                          stocks={field.value.map((val) => val.stock)}
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
                          onBarcodeChanged={(val, index) => {
                            field.value[index].barcode = val;
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
            <div className="mb-4 rounded-sm border">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="justify-center bg-gray-200 p-3 text-sm text-black">
                      <h5 className="text-sm">Description</h5>
                      <FormMessage className="mr-2 text-xs" />
                    </FormLabel>
                    <FormControl className="border-none">
                      <Textarea
                        className="!mt-0 min-h-[100px] flex-1 resize-none !rounded-none p-2 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                        onKeyDown={(e) => e.stopPropagation()}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-4 rounded-sm border">
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="justify-center bg-gray-200 p-3 text-sm text-black">
                      <h5 className="text-sm">Note</h5>
                      <FormMessage className="mr-2 text-xs" />
                    </FormLabel>
                    <FormControl className="border-none">
                      <Textarea
                        className="!mt-0 min-h-[100px]  flex-1 resize-none !rounded-none p-2 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
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
                className="min-w-[150px] px-4 uppercase"
                disabled={isCreatingNewProduct}
              >
                Save
                <LoadingCircle
                  className={
                    "ml-4 !w-4 " + (isCreatingNewProduct ? "" : "hidden")
                  }
                />
              </Button>
              <Button
                variant={"green"}
                type="button"
                className="min-w-[150px] bg-gray-400 px-4 uppercase hover:bg-gray-500"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onChangeVisibility(false);
                }}
                disabled={isCreatingNewProduct}
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
  originalPrice,
  onOriginalPriceChanged,
  onOriginalPriceBlur,
  onExchangeValueChanged,
  onExchangeValueBlur,
  onPriceChanged,
  onPriceBlur,
  onRemoveClick,
}: {
  unitName: string;
  exchangeValue: number;
  price: number;
  originalPrice: number;
  onUnitNameChanged: (val: string) => void;
  onUnitNameBlur: () => void;
  onExchangeValueChanged: (val: number) => void;
  onExchangeValueBlur: () => void;
  onPriceChanged: (val: number) => void;
  onOriginalPriceChanged: (val: number) => void;
  onOriginalPriceBlur: () => void;
  onPriceBlur: () => void;
  onRemoveClick: () => void;
}) => {
  return (
    <div className="mb-2 ml-4 flex flex-row items-center gap-4 text-[0.85rem]">
      <div className="flex flex-1 flex-col">
        <p className="font-semibold">Unit name</p>
        <input
          value={unitName}
          onChange={(e) => onUnitNameChanged(e.target.value)}
          className="border-b border-blue-300 p-1"
          onBlur={onUnitNameBlur}
        />
      </div>
      <div className="flex flex-1 flex-col">
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
      <div className="flex flex-1 flex-col">
        <p className="font-semibold">Original price</p>
        <input
          value={originalPrice}
          type="number"
          min={0}
          onChange={(e) => onOriginalPriceChanged(e.target.valueAsNumber)}
          onBlur={onOriginalPriceBlur}
          className="border-b border-blue-300 p-1 text-end"
        />
      </div>
      <div className="flex flex-1 flex-col">
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
  units,
  originalPrices,
  productPrices,
  stocks,
  barcodes,
  onOriginalPriceChanged,
  onProductPriceChanged,
  onStockChanged,
  onBarcodeChanged,
  onRemoveClick,
}: {
  properties: Record<string, string>[];
  units: string[];
  originalPrices: number[];
  productPrices: number[];
  stocks: number[];
  barcodes: string[];
  onOriginalPriceChanged: (val: number, index: number) => any;
  onProductPriceChanged: (val: number, index: number) => any;
  onStockChanged: (val: number, index: number) => any;
  onBarcodeChanged: (val: string, index: number) => any;
  onRemoveClick: (index: number) => any;
}) => {
  return (
    <div className="flex w-full flex-col items-center gap-3 p-1 text-[0.8rem]">
      <div className="flex w-full flex-row gap-2">
        <p className="flex-1 text-center font-semibold">Property</p>
        <p className="flex-1 text-center font-semibold">Unit</p>
        <p className="flex-1 text-center font-semibold">Barcode</p>
        <p className="flex-1 text-center font-semibold">Original price</p>
        <p className="flex-1 text-center font-semibold">Product price</p>
        <p className="flex-1 text-center font-semibold">Stock</p>
        <div className="w-[50px]" /> {/* for trash bin*/}
      </div>
      {originalPrices.map((_, idx) => {
        return (
          <div
            key={idx}
            className="flex w-full flex-row items-center justify-center gap-2"
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
                  <p>{units && units[idx] ? units[idx] : ""}</p>
                </div>
              );
            })()}
            {(() => {
              return (
                <input
                  value={barcodes[idx]}
                  placeholder="Generate automatically"
                  onChange={(e) => onBarcodeChanged(e.target.value, idx)}
                  className="min-w-[0px] flex-1 border-b border-blue-300 p-1 text-end"
                />
              );
            })()}
            {(() => {
              return (
                <input
                  value={originalPrices[idx]}
                  type="number"
                  min={0}
                  onChange={(e) =>
                    onOriginalPriceChanged(e.target.valueAsNumber, idx)
                  }
                  className="min-w-[0px] flex-1 border-b border-blue-300 p-1 text-end"
                />
              );
            })()}
            {(() => {
              return (
                <input
                  value={productPrices[idx]}
                  type="number"
                  min={0}
                  onChange={(e) =>
                    onProductPriceChanged(e.target.valueAsNumber, idx)
                  }
                  className="min-w-[0px] flex-1 border-b border-blue-300 p-1 text-end"
                />
              );
            })()}
            {(() => {
              return (
                <input
                  value={stocks[idx]}
                  type="number"
                  min={0}
                  onChange={(e) => onStockChanged(e.target.valueAsNumber, idx)}
                  className="min-w-[0px] flex-1 border-b border-blue-300 p-1 text-end"
                />
              );
            })()}
            <Trash
              size={16}
              className="w-[50px] hover:cursor-pointer"
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
      message = customError[i].key
        ? customError[i].key.message
        : customError[i].values
          ? customError[i].values.message
          : null;
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
            : customError.otherUnits[i].price
              ? customError.otherUnits[i].price.message
              : null;
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

const ButtonAddNewThing = ({
  triggerTitle,
  title,
  placeholder,
  open,
  onOpenChange,
  onAddClick,
}: {
  triggerTitle: string;
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
        <Button
          variant={"green"}
          className="ml-4 mt-2 h-[35px] border"
          type="button"
        >
          {triggerTitle}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <div className="!my-4 flex flex-row items-center gap-3 text-sm">
            <label htmlFor="alert_input" className="w-36 font-semibold">
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
          <Button
            variant={"green"}
            onClick={async (e) => {
              setIsLoading(true);
              onAddClick(value)
                .then((e) => {
                  onOpenChange(false);
                })
                .finally(() => setIsLoading(false));
            }}
            disabled={isLoading}
            className="!h-[35px]"
          >
            Done
            {isLoading ? <LoadingCircle /> : null}
          </Button>
          <AlertDialogCancel
            className={
              "!h-[35px] bg-red-400 text-white hover:bg-red-500 hover:text-white"
            }
            disabled={isLoading}
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const UpdatePropertyView = ({
  property,
  onUpdateClick,
  onUpdateSuccess,
  onDeleteClick,
  onDeleteSuccess,
}: {
  property: {
    id: number;
    key: string;
  };
  onUpdateClick: (value: string, propertyId: number) => Promise<any>;
  onUpdateSuccess: (value: string, propertyId: number) => any;
  onDeleteClick: (propertyId: number) => Promise<any>;
  onDeleteSuccess: (propertyId: number) => any;
}) => {
  const Input = ({
    inputValue,
    setOpen,
  }: {
    inputValue: string;
    setOpen: any;
  }) => {
    const [value, setValue] = useState(inputValue);
    const [isLoading, setIsLoading] = useState(false);

    return (
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Change property</AlertDialogTitle>
          <div className="!my-4 flex flex-row items-center gap-3 text-sm">
            <label htmlFor="alert_input" className="w-36 font-semibold">
              Property&apos;s name
            </label>

            <input
              id="alert_input"
              defaultValue={property.key}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 rounded-sm border p-1"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant={"green"}
            onClick={async (e) => {
              setIsLoading(true);
              await onUpdateClick(value, property.id)
                .then(() => {
                  onUpdateSuccess(value, property.id);
                })
                .finally(() => {
                  setIsLoading(false);
                  setOpen(false);
                });
            }}
            disabled={isLoading}
          >
            Done
            {isLoading ? <LoadingCircle /> : null}
          </Button>
          <Button
            variant={"red"}
            onClick={async (e) => {
              setIsLoading(true);
              await onDeleteClick(property.id)
                .then(() => {
                  onDeleteSuccess(property.id);
                })
                .finally(() => {
                  setIsLoading(false);
                  setOpen(false);
                });
            }}
            disabled={isLoading}
          >
            Delete property
            {isLoading ? <LoadingCircle /> : null}
          </Button>
          <AlertDialogCancel
            className={
              "!h-[35px] bg-red-400 text-white hover:bg-red-500 hover:text-white"
            }
            disabled={isLoading}
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
  };
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger onClick={(e) => e.stopPropagation()}>
        <Pencil size={16} />
      </AlertDialogTrigger>
      <Input inputValue={property.key} setOpen={setOpen} />
    </AlertDialog>
  );
};

type CartesianResult = Record<string, string>;
function cartesian(
  input: { values: string[]; key: string }[],
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

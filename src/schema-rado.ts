import {
  pgTable,
  varchar,
  date,
  text,
  integer,
  doublePrecision,
  index,
  serial,
} from "rado/postgres";

export const customers = pgTable(
  "customers",
  {
    id: serial("id").primaryKey(),
    companyName: text("company_name").notNull(),
    contactName: varchar("contact_name").notNull(),
    contactTitle: varchar("contact_title").notNull(),
    address: varchar("address").notNull(),
    city: varchar("city").notNull(),
    postalCode: varchar("postal_code"),
    region: varchar("region"),
    country: varchar("country").notNull(),
    phone: varchar("phone").notNull(),
    fax: varchar("fax"),
  }
);

export const employees = pgTable(
  "employees",
  {
    id: serial("id").primaryKey(),
    lastName: varchar("last_name").notNull(),
    firstName: varchar("first_name"),
    title: varchar("title").notNull(),
    titleOfCourtesy: varchar("title_of_courtesy").notNull(),
    birthDate: date("birth_date", { mode: "date" }).notNull(),
    hireDate: date("hire_date", { mode: "date" }).notNull(),
    address: varchar("address").notNull(),
    city: varchar("city").notNull(),
    postalCode: varchar("postal_code").notNull(),
    country: varchar("country").notNull(),
    homePhone: varchar("home_phone").notNull(),
    extension: integer("extension").notNull(),
    notes: text("notes").notNull(),
    recipientId: integer("recipient_id"),
  },
  (table) => ({
    recepientIdx: index().on(table.recipientId),
  })
);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderDate: date("order_date", { mode: "date" }).notNull(),
  requiredDate: date("required_date", { mode: "date" }).notNull(),
  shippedDate: date("shipped_date", { mode: "date" }),
  shipVia: integer("ship_via").notNull(),
  freight: doublePrecision("freight").notNull(),
  shipName: varchar("ship_name").notNull(),
  shipCity: varchar("ship_city").notNull(),
  shipRegion: varchar("ship_region"),
  shipPostalCode: varchar("ship_postal_code"),
  shipCountry: varchar("ship_country").notNull(),

  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),

  employeeId: integer("employee_id")
    .notNull()
    .references(() => employees.id),
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name").notNull(),
  contactName: varchar("contact_name").notNull(),
  contactTitle: varchar("contact_title").notNull(),
  address: varchar("address").notNull(),
  city: varchar("city").notNull(),
  region: varchar("region"),
  postalCode: varchar("postal_code").notNull(),
  country: varchar("country").notNull(),
  phone: varchar("phone").notNull(),
});

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    quantityPerUnit: varchar("qt_per_unit").notNull(),
    unitPrice: doublePrecision("unit_price").notNull(),
    unitsInStock: integer("units_in_stock").notNull(),
    unitsOnOrder: integer("units_on_order").notNull(),
    reorderLevel: integer("reorder_level").notNull(),
    discontinued: integer("discontinued").notNull(),

    supplierId: serial("supplier_id")
      .notNull()
      .references(() => suppliers.id),
  },
  (table) => {
    return {
      supplierIdx: index().on(table.supplierId),
    };
  }
);

export const details = pgTable(
  "order_details",
  {
    unitPrice: doublePrecision("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    discount: doublePrecision("discount").notNull(),

    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id),

    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
  },
  (t) => {
    return {
      orderIdIdx: index().on(t.orderId),
      productIdIdx: index().on(t.productId),
    };
  }
);

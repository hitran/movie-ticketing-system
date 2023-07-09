import { z } from "zod";

export const PaginationOptsSchema = z.object({
  page: z.coerce.number().positive().int().optional(),
  limit: z.coerce.number().positive().int().optional(),
});

export const GetMovieOptionsSchema = z.object({
  onlyReleased: z.boolean().optional().default(true),
  includeIsReleased: z.boolean().optional().default(false),
});

// ==============================================
// --> Movie schemas
// ==============================================

export const NewMovieSchema = z.object({
  title: z.string(),
  seatAvailable: z.number().nonnegative(),
  isReleased: z.boolean(),
});

export const MovieSchema = NewMovieSchema.extend({
  id: z.number(),
});

// ==============================================
// --> Ticket schemas
// ==============================================

export const NewTicketSchema = z.object({
  type: z.string().toLowerCase(),
  price: z.number().positive().optional().nullable().default(null),
});

export const TicketSchema = NewTicketSchema.extend({
  qty: z.number().positive(),
});

export const GroupTicketSchema = NewTicketSchema.extend({
  components: z.array(TicketSchema),
});

export const NewTicketComponent = z.object({
  type: z.string().toLowerCase(),
  component: z.string().toLowerCase(),
  qty: z.number().int().positive(),
});

// ==============================================
// --> Customer schemas
// ==============================================

export const NormalCustomerSchema = z.object({
  id: z.optional(z.number()),
  name: z.string(),
  email: z.string().email(),
  type: z.literal("Normal"),
  discountRate: z.literal(0).nullable().default(0),
});

export const FlatCustomerSchema = NormalCustomerSchema.extend({
  type: z.literal("Flat"),
  discountRate: z.number().gt(0).lte(1),
});

export const StepCustomerSchema = FlatCustomerSchema.extend({
  type: z.literal("Step"),
  threshold: z.number().positive(),
});

export const NewCustomerSchema = z.union([
  NormalCustomerSchema.extend({
    threshold: z.literal(null).optional().nullable().default(null),
  }),
  FlatCustomerSchema.extend({
    threshold: z.literal(null).optional().nullable().default(null),
  }),
  StepCustomerSchema,
]);

export const UpdateCustomerSchema = z
  .object({
    newEmail: z.string().email().optional().nullable().default(null),
    name: z.string().optional().nullable().default(null),
    type: z.literal("Normal"),
  })
  .or(
    z.object({
      newEmail: z.string().email().optional().nullable().default(null),
      name: z.string().optional().nullable().default(null),
      type: z.literal("Flat"),
      discountRate: z.number().gt(0).lte(1).optional().nullable().default(null),
    })
  )
  .or(
    z.object({
      newEmail: z.string().email().optional().nullable().default(null),
      name: z.string().optional().nullable().default(null),
      type: z.literal("Step"),
      discountRate: z.number().gt(0).lte(1).optional().nullable().default(null),
      threshold: z.number().positive().optional().nullable().default(null),
    })
  );

export const UpdateCustomersSchema = z
  .object({
    type: z.literal("Flat"),
    discountRate: z.number().gt(0).lte(1),
  })
  .or(
    z.object({
      type: z.literal("Step"),
      threshold: z.number().positive(),
    })
  );

// ==============================================
// --> Booking schemas
// ==============================================

export const NewBookingSchema = z.object({
  customer: z.union([
    NormalCustomerSchema.extend({
      threshold: z.literal(null).optional().nullable().default(null),
    }),
    FlatCustomerSchema.extend({
      threshold: z.literal(null).optional().nullable().default(null),
    }),
    StepCustomerSchema,
  ]),
  title: z.string(),
  tickets: z.array(TicketSchema).min(1),
});

export const BookingSchema = NewBookingSchema.extend({
  id: z.number(),
});

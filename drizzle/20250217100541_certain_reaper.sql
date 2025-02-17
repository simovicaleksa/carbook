CREATE TABLE "history" (
	"id" serial PRIMARY KEY NOT NULL,
	"at_distance_traveled" integer NOT NULL,
	"type" text NOT NULL,
	"description" text DEFAULT '',
	"date" date NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"created_at" timestamp (3) DEFAULT now(),
	"updated_at" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "money" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" integer,
	"currency" text NOT NULL,
	"history_entry_id" integer,
	"created_at" timestamp (3) DEFAULT now(),
	"updated_at" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"preferred_units" text DEFAULT 'metric' NOT NULL,
	"preferred_currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"user_id" uuid NOT NULL,
	"selected_vehicle_id" uuid,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"username" varchar(16) NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp (3) DEFAULT now(),
	"updated_at" timestamp (3),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"make" varchar(255) NOT NULL,
	"model" varchar(255) NOT NULL,
	"year" integer NOT NULL,
	"distance_traveled" integer DEFAULT 0 NOT NULL,
	"owner_id" uuid NOT NULL,
	"created_at" timestamp (3) DEFAULT now(),
	"updated_at" timestamp (3)
);
--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "money" ADD CONSTRAINT "money_history_entry_id_history_id_fk" FOREIGN KEY ("history_entry_id") REFERENCES "public"."history"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_selected_vehicle_id_vehicles_id_fk" FOREIGN KEY ("selected_vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
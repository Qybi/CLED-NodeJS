create table "Users" (
	"id" serial primary key,
	"firstname" varchar(255),
	"lastname" varchar(255)
);

create table "Votes" (
	"id" serial primary key,
	"userId" int,
	"Subject" text not null,
	"Vote" int not null,
	FOREIGN KEY ("userId") REFERENCES "Users"("id")
)
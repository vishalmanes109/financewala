
create table transaction (
	id varchar(20) primary key, 
	title varchar(50) not null,
	description text not null,
	amount decimal not null check(amount >0),
	date timestamp not null,
	mode_of_payment varchar(50) default '-1',
	essential smallint  default -1 ,
	category_id serial not null,
	currency_id int not null,
	transaction_type_id serial not null,
	user_id serial not null ,
	
	CONSTRAINT fk_transaction_currency_id
      FOREIGN KEY(currency_id) 
	  REFERENCES currency(id),

	CONSTRAINT fk_transaction_category_id
      FOREIGN KEY(category_id) 
	  REFERENCES category(id),
	
	CONSTRAINT fk_transaction_type_id
      FOREIGN KEY(transaction_type_id) 
	  REFERENCES transaction_type(id)

);


create table category (
	id serial primary key ,
	name varchar(50) not null,
	transaction_type_id serial ,
	CONSTRAINT fk_category_transaction_type_id
      FOREIGN KEY(transaction_type_id) 
	  REFERENCES transaction_type(id)
);

create table currency (id serial  primary key, name varchar(20) not null , country varchar (50) not null ,symbol varchar(20)  );


create table transaction_type (
id serial primary key,
type varchar not null
);

--  *************** insert transactions dummy**************** -- 
INSERT INTO public.transaction(
	id, title, description, amount, date,
	mode_of_payment, essential, category_id, currency_id,
	transaction_type_id, user_id)
	VALUES ('4', 'home emi', 'this month home emi ', 15000, now(),
			'debit', 1,  9 ,5 , 2,1);


INSERT INTO public.transaction(
	id, title, description, amount, date,
	mode_of_payment, essential, category_id, currency_id,
	transaction_type_id, user_id)
	VALUES ('5', 'travel', 'travel to home', 8000, now(),
			'debit', 1,  23 ,5 , 2,1);


INSERT INTO public.transaction(
	id, title, description, amount, date,
	mode_of_payment, essential, category_id, currency_id,
	transaction_type_id, user_id)
	VALUES ('6', 'grooming', 'grmming hair prodo', 1000, now(),
			'credit', 1,  17 ,5 , 2,1);
			

INSERT INTO public.transaction(
	id, title, description, amount, date,
	mode_of_payment, essential, category_id, currency_id,
	transaction_type_id, user_id)
	VALUES ('7', 'bill', 'internet bill', 500, now(),
			'credit', 1,  13 ,5 , 2,1);
			

	INSERT INTO public.transaction(
		id, title, description, amount, date,
		mode_of_payment, essential, category_id, currency_id,
		transaction_type_id, user_id)
		VALUES ('8', 'stock', 'invested bill', 5000, now(),
				'debit', -1,  28 ,5 , 3,1);

	

	INSERT INTO public.transaction(
		id, title, description, amount, date,
		mode_of_payment, essential, category_id, currency_id,
		transaction_type_id, user_id)
		VALUES ('9', 'retire', 'retire plan', 5000, now(),
				'debit', -1,  29 ,5 , 3,1);

				
	INSERT INTO public.transaction(
		id, title, description, amount, date,
		mode_of_payment, essential, category_id, currency_id,
		transaction_type_id, user_id)
		VALUES ('10', 'health', 'health plan', 5000, now(),
				'debit', -1,  31 ,5 , 3,1);

				



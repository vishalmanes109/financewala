CREATE TABLE user_i (
	id serial PRIMARY KEY,
	name VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
	avatar VARCHAR ( 255 ) UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL,
	theme boolean,
    last_login TIMESTAMP ,
	currency_id int not null,
	CONSTRAINT fk_currency_user_id
      FOREIGN KEY(currency_id) 
	  REFERENCES currency(id)
);
create table transaction (
	id varchar(20) primary key, 
	title varchar(50) not null,
	description text not null,
	amount decimal not null check(amount >0),
	date timestamp not null,
	mode_of_payment varchar(50) default '-1',
	category_id varchar(20) not null,
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
	  REFERENCES transaction_type(id),

	  CONSTRAINT fk_transaction_user_id
      FOREIGN KEY(user_id) 
	  REFERENCES user_i(id)
);

create table category (id serial primary key , name varchar(50) not null);

create table currency (id serial  primary key, name varchar(20) not null , country varchar (50) not null );


create table transaction_type (
id serial primary key,
type varchar not null
);

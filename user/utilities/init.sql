CREATE TABLE user_i (
	id serial PRIMARY KEY,
	name VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
	email varchar (255) UNIQUE ,
	avatar VARCHAR ( 255 )  NOT NULL,
	created_on TIMESTAMP NOT NULL,
	theme varchar (50) default 'Light',
    last_login TIMESTAMP ,
	password_reset_token text ,
	currency_id int not null,
	CONSTRAINT fk_currency_user_id
      FOREIGN KEY(currency_id) 
	  REFERENCES currency(id)
);

create table currency (id serial  primary key, name varchar(20) not null , country varchar (50) not null ,symbol varchar(20)  );

CREATE TABLE user_i (
	id serial PRIMARY KEY,
	name VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
	email varchar (255) unique ,
	avatar VARCHAR ( 255 ) UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL,
	theme boolean,
    last_login TIMESTAMP ,
	currency_id int not null,
	CONSTRAINT fk_currency_user_id
      FOREIGN KEY(currency_id) 
	  REFERENCES currency(id)
);


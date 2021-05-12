 
create table trans_metadata (
	id varchar(20) primary key, 
	title varchar(50) not null,
	amount decimal not null check(amount >0),
	date timestamp not null,
	mode_of_payment varchar(50) ,
	essential smallint   not null ,
	category_id serial not null,
	transaction_type_id serial not null,
	user_id serial not null ,
	

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


create table transaction_type (
id serial primary key,
type varchar not null
);

insert into transaction_type(id,type) values(1,'income');
insert into transaction_type(id,type) values(2,'expense');
insert into transaction_type(id,type) values(3,'transfer');


--  *************** insert into category************
insert into category(id,name,transaction_type_id) values(1,'salary',1);
insert into category(id,name,transaction_type_id) values(2,'investment return',1);
insert into category(id,name,transaction_type_id) values(3,'pension',1);
insert into category(id,name,transaction_type_id) values(4,'wedges',1);
insert into category(id,name,transaction_type_id) values(5,'commision',1);
insert into category(id,name,transaction_type_id) values(6,'allowance/pocket money',1);
insert into category(id,name,transaction_type_id) values(7,'gifts',1);
insert into category(id,name,transaction_type_id) values(8,'grocery',2);
insert into category(id,name,transaction_type_id) values(9,'home rent/emi',2);


DROP DATABASE IF EXISTS yore;
create database yore;
use yore;


create table product_categories(
    id int primary key auto_increment,
    category_name varchar(255) not null
);

create table genders(
    id int primary key auto_increment,
    gender_name varchar(255) not null
);

insert into genders (gender_name) values ('male'), ('female'), ('other');

-- Country of Origin Table
CREATE TABLE country_of_origin (
    country_id INT PRIMARY KEY,
    country_name VARCHAR(100)
);

create table products(
    id int primary key auto_increment,
    name varchar(255) not null,
    price decimal(10,2) not null,
    description text,
    image_url varchar(255),
    category_id int,
    country_id int,
    year_made int,
    auctioned_for_today boolean,
    sold boolean,
    foreign key (category_id) references categories(id),
    foreign key (country_id) references countryoforigin(country_id),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);


-- Bidders Table
CREATE TABLE role (
    role_id INT PRIMARY KEY,
    role VARCHAR(100)
);

insert into role (role) values ('bidder'), ('auctioneer'), ('manager'), ('others');

-- Bidders Table
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    full_name VARCHAR(100),
    phone_no VARCHAR(255),
    email VARCHAR(100),
    password VARCHAR(100),
    age int,
    gender_id int,
    registration_date DATETIME,
    role int,
    foreign key (role) references role(role_id),
    foreign key (gender_id) references genders(id),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);

-- Orders Table
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    product_id INT,
    bidder_id INT,
    auctioneer_id INT,
    order_date DATETIME,
    final_price DECIMAL(15,2),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (bidder_id) REFERENCES users(user_id),
    FOREIGN KEY (auctioneer_id) REFERENCES users(user_id),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);

-- Visitors Table
CREATE TABLE visitors (
    visitor_id INT PRIMARY KEY,
    full_name VARCHAR(100),
    visit_date DATETIME,
    phone_no CHAR(10),
    age INT,
    email VARCHAR(100)
);
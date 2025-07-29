DROP DATABASE IF EXISTS yore;
create database yore;
use yore;


create table categories(
    id int primary key auto_increment,
    category_name varchar(255) not null
);

create table genders(
    id int primary key auto_increment,
    gender_name varchar(255) not null
);

insert into genders (gender_name) values ('male'), ('female'), ('other');

-- Country of Origin Table
CREATE TABLE countryoforigin (
    country_id INT PRIMARY KEY,
    country_name VARCHAR(100)
);

-- Employee Categories Table
CREATE TABLE employeecategories (
    emp_category_id INT PRIMARY KEY,
    category_name VARCHAR(50)
);

create table products(
    id int primary key auto_increment,
    name varchar(255) not null,
    price decimal(10,2) not null,
    description text,
    image_url varchar(255),
    category_id int,
    country_id int,
    year_made YEAR,
    foreign key (category_id) references categories(id),
    foreign key (country_id) references countryoforigin(country_id),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);

-- Bidders Table
CREATE TABLE bidders (
    bidder_id INT PRIMARY KEY,
    full_name VARCHAR(100),
    phone_no VARCHAR(255),
    email VARCHAR(100),
    password VARCHAR(100),
    age int,
    gender_id int,
    foreign key (gender_id) references genders(id),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    log1 VARCHAR(50),
    log2 VARCHAR(50),
    log3 VARCHAR(50),
    log4 VARCHAR(50)
);

-- Orders Table
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    product_id INT,
    bidder_id INT,
    order_date DATETIME,
    final_price DECIMAL(15,2),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (bidder_id) REFERENCES bidders(bidder_id),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);

create table adminUser(
    id int primary key auto_increment,
    name varchar(225) not null,
    email varchar(225) not null,
    password varchar(225) not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);

-- Auctioneer Table
CREATE TABLE auctioneer (
    auctioneer_id INT PRIMARY KEY,
    full_name VARCHAR(100),
    phone_no CHAR(10),
    email VARCHAR(100),
    password VARCHAR(100),
    age int,
    gender_id int,
    foreign key (gender_id) references genders(id),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);

-- Employees Table
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    full_name VARCHAR(100),
    emp_category_id INT,
    hire_date DATE,
    phone_no CHAR(10),
    age int,
    gender_id int,
    foreign key (gender_id) references genders(id),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    FOREIGN KEY (emp_category_id) REFERENCES employeecategories(emp_category_id)
);

-- Museum Manager Table
CREATE TABLE museummanager (
    manager_id INT PRIMARY KEY,
    full_name VARCHAR(100),
    phone_no CHAR(10),
    email VARCHAR(100),
    registration_date DATETIME,
    password VARCHAR(100),
    age int,
    gender_id int,
    foreign key (gender_id) references genders(id),
    log1 VARCHAR(50),
    log2 VARCHAR(50),
    log3 VARCHAR(50),
    log4 VARCHAR(50),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);

-- Product Owners Table
CREATE TABLE productowners (
    ownership_id INT PRIMARY KEY,
    product_id INT,
    bidder_id INT,
    order_id INT,
    ownership_date DATE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (bidder_id) REFERENCES bidders(bidder_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Session Auction Product Table
CREATE TABLE sessionauctionproduct (
    session_id INT PRIMARY KEY,
    product_id INT,
    manager_id INT,
    auctioneer_id INT,
    session_date DATE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (manager_id) REFERENCES museummanager(manager_id),
    FOREIGN KEY (auctioneer_id) REFERENCES auctioneer(auctioneer_id)
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
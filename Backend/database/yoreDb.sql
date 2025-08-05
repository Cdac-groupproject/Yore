DROP DATABASE IF EXISTS yore;
create database yore;
use yore;


create table product_categories(
    category_id int primary key auto_increment,
    name varchar(255) not null
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
    product_id int primary key auto_increment,
    name varchar(255) not null,
    price decimal(10,2),
    description text,
    image_url varchar(255),
    product_category int,
    country_of_origin int,
    year_made int,
    auctioned_for_today boolean,
    sold boolean,
    foreign key (product_category) references product_categories(category_id),
    foreign key (country_of_origin) references country_of_origin(country_id),
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

--auctions Table
CREATE TABLE auctions (
    auction_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    product_id BIGINT NOT NULL UNIQUE,
    auctioneer_id BIGINT NOT NULL,

    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,  -- derived from start_time + duration

    duration_minutes INT NOT NULL,  -- e.g., 5, 10, 30

    is_closed BOOLEAN DEFAULT FALSE,
    winner_user_id BIGINT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_auction_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_auctioneer
        FOREIGN KEY (auctioneer_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_auction_winner
        FOREIGN KEY (winner_user_id) REFERENCES users(user_id)
        ON DELETE SET NULL
);

--Bids Table
CREATE TABLE bids (
    bid_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    auction_id BIGINT NOT NULL,
    bidder_id BIGINT NOT NULL,
    bid_amount DECIMAL(15,2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_auction_bid FOREIGN KEY (auction_id) REFERENCES auctions(auction_id),
    CONSTRAINT fk_user_bidder FOREIGN KEY (bidder_id) REFERENCES users(userId)
);

--employee_categories table
create table employee_categories(
    designation_id int primary key auto_increment,
    employee_designation varchar(255) not null
);

--employee table
create table employee(
    employee_id int primary key auto_increment,
    name varchar(255) not null,
    email varchar(255) not null,
    category_id int,
    foreign key (category_id) references employee_categories(designation_id)
);

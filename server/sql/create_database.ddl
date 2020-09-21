\encoding UTF-8

create table user_master (
  id varchar(100),
  name varchar(4000),
  image bytea,
  email varchar(255),
  PRIMARY KEY (id)
)

create table user_auth (
  id varchar(100),
  password varchar(64),
  PRIMARY KEY (id)
);

create table active_token (
  token varchar(64),
  user_id varchar(100),
  create_date timestamp,
  PRIMARY KEY (token)
);

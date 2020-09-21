\encoding UTF-8

create table pnet_master (
  id varchar(100),
  name_kana varchar(4000),
  belong varchar(4000),
  self_intro text,
  PRIMARY KEY (id)
);

create table pnet_hobby (
  user_id varchar(100),
  id varchar(64),
  title varchar(128),
  detail text,
  PRIMARY KEY (id, user_id)
);

create table pnet_tag (
  tag_id varchar(64),
  user_id varchar(100),
  title varchar(100),
  PRIMARY KEY (tag_id, user_id)
);

create table pnet_tag_reaction (
  tag_id varchar(64),
  tag_user_id varchar(100),
  action_user_id varchar(100),
  comment text,
  reaction varchar(32),
  PRIMARY KEY (tag_id, tag_user_id, action_user_id)
);

create table pnet_career (
  history_id varchar(64),
  user_id varchar(100),
  title varchar(100),
  year date,
  detail text,
  create_user_cd varchar(100),
  PRIMARY KEY (history_id, user_id)
);


create table pnet_career_pr (
  history_id varchar(64),
  user_id varchar(100),
  title varchar(100),
  year date,
  detail text,
  create_user_cd varchar(100),
  PRIMARY KEY (history_id, user_id)
);

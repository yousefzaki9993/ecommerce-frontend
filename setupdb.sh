#!/bin/bash

export $(grep -v '^#' .env | xargs)
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD < creatDB.sql
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < insertDB.sql

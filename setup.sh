#!/bin/bash

''' 
Requirements:

1. Git
2. Python3 >= 3.7
3. Pip3
4. Virtualenv
5. Latest Version of `Wheel and setuptools`
6. Docker and docker-compose
'''


# Create Virtual Environment
python3 -m virtualenv env

source ./env/bin/activate

# Install DBT CLI
# git clone https://github.com/dbt-labs/dbt-core.git

# cd dbt-core

# pip install -r requirements.txt

# cd ..

# # Install Plugin
# pip install dbt-mysql

# # Install LightDash Locally
# git clone https://github.com/lightdash/lightdash

# cd lightdash
# # For LightDash RUN

# LIGHTDASH_SECRET="lightdash" PGPASSWORD="lightdash" docker-compose -f docker-compose.yml up --detach --remove-orphans 

# cd ..

# sudo apt install unixodbc

# npm install -g @lightdash/cli

# Export Environment Variables for Profile
export DBT_PROFILES_DIR=./
export DB_USER="airport_user"
export DB_PASSEWORD="secret"

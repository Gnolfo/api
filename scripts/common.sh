#!/bin/bash

function __make_header()
{
    echo " "
    echo -e "\033[48;5;22m API › $1  \033[0m"
    echo " "
}

function __output()
{
    echo "→ API › $1"
}

function __success()
{
    echo -e "\033[38;5;34m✓ API › $1 \033[0m"
    echo " "
}

function __notice()
{
    echo -e "\033[38;5;220m→ API › $1\033[0m"
    echo " "
}

function __error()
{
    echo " "
    echo " "
    echo -e "\033[38;5;196m! API › $1\033[0m"
    echo " "
}

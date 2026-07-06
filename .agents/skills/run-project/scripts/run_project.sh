#!/bin/bash

COMMAND=$1

# Navigate to root directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ROOT_DIR="$(dirname "$(dirname "$(dirname "$(dirname "$SCRIPT_DIR")")")")"
cd "$ROOT_DIR" || exit 1

case $COMMAND in
    "setup")
        echo -e "\033[36mRunning Setup (Build & Start)... Note: Requires Internet/VPN!\033[0m"
        docker-compose up -d --build
        ;;
    "start-offline")
        echo -e "\033[36mRunning Start Offline... No Internet required.\033[0m"
        docker-compose up -d
        ;;
    "reboot")
        echo -e "\033[36mRebooting containers...\033[0m"
        docker-compose restart
        ;;
    "stop")
        echo -e "\033[36mStopping containers...\033[0m"
        docker-compose down
        ;;
    *)
        echo -e "\033[31mError: Unknown command '$COMMAND'.\033[0m"
        echo -e "\033[33mAvailable commands: setup, start-offline, reboot, stop\033[0m"
        exit 1
        ;;
esac

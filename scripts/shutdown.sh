#!/usr/bin/env bash

kill -SIGINT $(lsof -nP -i4TCP:8545 | grep LISTEN | awk '{print $2}')

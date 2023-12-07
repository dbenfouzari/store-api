import "reflect-metadata";

import express from "express";

import { Server } from "@infrastructure/Server";
import { ConfigService } from "@infrastructure/config/ConfigService";

const app = express();
const server = new Server(app, new ConfigService());

server.start();

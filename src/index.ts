// noinspection JSIgnoredPromiseFromCall

import "reflect-metadata";

import { container } from "tsyringe";

import { Server } from "@infrastructure/Server";
import { DependencyRegistrar } from "@infrastructure/di/DependencyRegistrar";

DependencyRegistrar.registerDependencies();

const server = container.resolve(Server);

server.start();

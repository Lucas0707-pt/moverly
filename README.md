# Deploy Guide

This repo holds two projects. The frontend page that is served as a simple HTML file, and an events back-office that can create and store the events in a separate database.

## Deploying Moverly

To deploy Moverly, the frontend application, it is first necessary to install all the required packages. That can be achieved with `npm ci`.

With this, it is possible to build the application. For that, all that is necessary is to run `vite build`, assuming that vite is executable as such. If it is not available, the command can be executed with `npx vite build`. This assumes that node.js and npm are both installed in the system.

In our test deployments, node version 18 is being used, so that is the recommended version.

When the build step is completed, an index.html file will be made available in the `dist` folder. This folder can then be used to serve the application.

## Deploying the Events back-office

Here, the same first steps for building Moverly also apply. We start by installing all the required packages with `npm ci`, and then build the application with `vite build` or `npx vite build`, according to the presence of the executable. This also assumes node 18 is being used in the system.

Since this project is using the Prisma ORM, some extra steps need to be taken. The package.json file includes a "vercel-build" (this was used since vercel was the platform chosen for our deployment), that must run before each install (not the actual npm script, just the commands inside it).

Besides, this project uses a PostgresSQL database to store the events. In our test deploy, a Supabase database was used, and the variables are stored in a .env at the root of the events project.

To successfuly deploy, a database should also be created (for example, with Supabase), and the appropriate variables should be stored as well. When doing this, it might be necessary to take into account some PostgresSQL restrictions like `pgbouncer`, and update the variables accordingly (in our case, we had to include a second env var for a direct url, since the default one was restricted).

After this, everything should be working appropriately and the build should be appear in the `public` folder. If not, then the most likely culprit is the Prisma ORM, which can cause some issues due to the binaries that it uses to work with the databases. The "vercel-build" script should be able to handle most issues, though.

With this completed, it is also possible to serve this app in the folder, and the deployment should be complete.

# SillyGeese-soen341projectF2023

## Project Description
Create a convenient and efficient real estate website that can be used by 4 different types of users: homebuyers, property renters, system administrator(s), and (real-state) brokers. The project will be completed over 4 sprints. The project will be generated with Angular and using the Agile methodology. The following 3 points are the base features to be included in the website.
1) Homebuyers/renters should be able to:
  - Search listings based on these properties:
      · Price range
      · Number of rooms
      · Room dimensions
      · Time in the market
      · Building type
      · Year built
      · Etc
  - Request a visit for a unit from a broker
  - Search for a broker
  - Calculate an estimate for a monthly payment plan of a unit (feature only available for homebuyers)
  - Save a property as a favorite
2) Broker
  - Submit and track an offer
  - Request visits for their clients
  - CRUD operations on their listings
  - Match properties to potential buyers
  - Manage and review offers for their listings
  - Manage visit requests for their listings
3) System administrators
  - Adding and removing brokers

## Group members/roles
1) Adam Oughourlian (Product owner)
2) Niki Adamacopoulos (QA)
3) Mostafa Hassan (Team leader)
4) Jean Naima (Database manager)
5) Franco G. Moro (Scrum master)
6) Anh Vi Mac (Design analyst)

For this project there was many options to choose from for back-end and front-end frameworks. This wiki pages explains some of the rationale for our design choices.


Back-End:

Node.js (Javascript)
Pros:
- Built for web development
- Very popular (a lot of examples/documentation online.)

Cons:
-  Need to write our own API and we would have to create our own database system.

Spring boot (Java)
Pros:
- Very Robust (everything is typed.)
- Well supported (docs + examples)
- Scalable (often used for enterprise scale projects.)

Cons:
- A lot of boilerplate code must be written
- Need to write our own API and we would have to create our own database system.

ASP.NET
Pros:
- Very Robust (everything is typed.)
- Well supported (docs + examples)
- Scalable (often used for enterprise scale projects.)

Cons:
- A lot of boilerplate code must be written
- Need to write our own API and we would have to create our own database system.
- Made by Microsoft


Front-End:

React:
Pros:

- Well documented 
- Popular
- Scalable

Cons: 
-  No typing 

Pure JS:

Pros:

- Good for learning 
- Taught by our professors
- No third party

Cons: 

- Hard to debug
- A lot of boilerplate
- No rules
- No Support


Angular:

Pros:
- Easily integrated with firebase
- Well documented (tutorials + doc)
- embedded html
- Team has experience with it.

Cons: 
- Routing may be difficult 
- Need for third party.


Final tech stack:

Our plan is to simply make an angular app with a Firebase connection. This would allow us to not have a back-end framework but still have access to a persistent database.





# House

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.2.

#Install Angular

First install node.js with your browser.

Then, with a terminal install angular and angular cli

`npm install angular`
`npm install angular-cli`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Firebase

The firebase database can be found here:https://console.firebase.google.com/u/0/project/soen341-e0993/firestore/data/~2Fbroker~2FE9dGq3AIipyCuatOeD4G

email franco.g.moro@gmail.com with the email address you want to use as login in order to request modification rights.

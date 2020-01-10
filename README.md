# Website
![](https://github.com/nfdh/website/workflows/CI/badge.svg)

This repository contains the source code of the new website for the Nederlandse Fokkersvereniging
Het Drentse Heideschaap.
The demo website is available on https://nieuw.drentsheideschaap.nl/

# Structure
### Frontend
The frontend consists of a react application together with an express web server running on node for SSR.

### Backend
The backend is written in PHP.
- **index.php** acts as a proxy for server side rendering.
- **query.php** accepts GraphQL queries, performs database queries and returns the result.
